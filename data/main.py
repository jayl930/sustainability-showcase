import os
import pandas as pd
import data
import determine


def update_merged_faculty():
    # Get new merged data from API+Selenium
    new_merged_df = data.combine_api_and_selenium(return_df=True)

    # Add active status to new data
    new_merged_df["active"] = True

    output_file = "merged_output.csv"

    if os.path.exists(output_file):
        existing_df = pd.read_csv(output_file)

        # Get list of emails currently in the API results
        current_emails = set(new_merged_df["email"])

        # Mark faculty not in latest API fetch as inactive
        existing_df.loc[~existing_df["email"].isin(current_emails), "active"] = False

        # For emails in both datasets, ensure they're marked active
        existing_df.loc[existing_df["email"].isin(current_emails), "active"] = True

        # Add only genuinely new faculty
        new_faculty = new_merged_df[
            ~new_merged_df["email"].isin(set(existing_df["email"]))
        ]

        # Combine existing (with updated active status) and new faculty
        combined_df = pd.concat([existing_df, new_faculty])
    else:
        combined_df = new_merged_df

    combined_df.to_csv(output_file, index=False)
    print(f"Updated merged faculty data saved to '{output_file}'.")
    return combined_df


def update_research_outputs():
    new_research_df = data.fetch_and_process_research_outputs(return_df=True)
    faculty_df = pd.read_csv("merged_output.csv")

    # Join active status from faculty to research outputs
    new_research_df = pd.merge(
        new_research_df,
        faculty_df[["uuid", "active"]],
        left_on="person_uuid",
        right_on="uuid",
        how="left",
        suffixes=("", "_faculty"),  # Add a meaningful suffix to avoid duplicate
    )

    # Drop the redundant uuid column from the join
    new_research_df = new_research_df.drop(columns=["uuid"])

    output_file = "person_research_outputs.csv"
    if os.path.exists(output_file):
        existing_df = pd.read_csv(output_file)

        # Count existing articles before update
        existing_article_count = existing_df.drop_duplicates(
            subset="article_uuid"
        ).shape[0]

        # Find genuinely new articles (not just new faculty-article relationships)
        new_articles = new_research_df[
            ~new_research_df["article_uuid"].isin(set(existing_df["article_uuid"]))
        ]

        new_article_count = new_articles.drop_duplicates(subset="article_uuid").shape[0]

        # Update active status for existing faculty in the research file
        faculty_status_map = dict(zip(faculty_df["uuid"], faculty_df["active"]))

        # Update active status based on the latest faculty data
        existing_df["active"] = existing_df["person_uuid"].map(
            lambda uuid: faculty_status_map.get(uuid, False)
        )

        # Preserve both article_uuid and person_uuid relationships
        combined_df = pd.concat([existing_df, new_research_df]).drop_duplicates(
            subset=["article_uuid", "person_uuid"], keep="first"
        )

        # Ensure only one active column is present
        if "active_faculty" in combined_df.columns:
            # Keep only the original active column
            combined_df = combined_df.drop(columns=["active_faculty"])

        print(f"Added {new_article_count} new unique articles to the dataset.")
        print(
            f"Total unique articles in dataset: {combined_df.drop_duplicates(subset='article_uuid').shape[0]}"
        )
    else:
        combined_df = new_research_df
        # Rename column if needed
        if "active_faculty" in combined_df.columns:
            combined_df = combined_df.rename(columns={"active_faculty": "active"})

        new_article_count = new_research_df.drop_duplicates(
            subset="article_uuid"
        ).shape[0]
        print(f"Created new dataset with {new_article_count} unique articles.")

    combined_df.to_csv(output_file, index=False)
    print(f"Updated research outputs saved to '{output_file}'.")
    return combined_df


def update_sdg_classifications():
    sdg_file = "person_research_outputs.csv"

    # If SDG classifications already exist, load them
    if os.path.exists(sdg_file):
        existing_sdg_df = pd.read_csv(sdg_file)

        # Step 1: Remove exact duplicates (same article_uuid AND person_uuid)
        existing_sdg_df = existing_sdg_df.drop_duplicates(
            subset=["article_uuid", "person_uuid"], keep="first"
        )

        # Step 2: For each article_uuid, if some rows have SDG data and others don't,
        # copy the SDG data to the empty rows
        if "is_sustain" in existing_sdg_df.columns:
            # Group by article_uuid
            for article_id, group in existing_sdg_df.groupby("article_uuid"):
                # Check if this article has both classified and unclassified rows
                classified_rows = group[~group["is_sustain"].isna()]

                if not classified_rows.empty:
                    # Get classification values from a classified row
                    sample_row = classified_rows.iloc[0]
                    is_sustain_value = sample_row["is_sustain"]

                    # Get top SDG values if they exist
                    top1_value = (
                        sample_row.get("top 1", 0) if "top 1" in sample_row else 0
                    )
                    top2_value = (
                        sample_row.get("top 2", 0) if "top 2" in sample_row else 0
                    )
                    top3_value = (
                        sample_row.get("top 3", 0) if "top 3" in sample_row else 0
                    )

                    # Fill in missing values for all rows with this article_uuid
                    for idx in group.index:
                        if pd.isna(existing_sdg_df.loc[idx, "is_sustain"]):
                            existing_sdg_df.loc[idx, "is_sustain"] = is_sustain_value
                            if "top 1" in existing_sdg_df.columns:
                                existing_sdg_df.loc[idx, "top 1"] = top1_value
                                existing_sdg_df.loc[idx, "top 2"] = top2_value
                                existing_sdg_df.loc[idx, "top 3"] = top3_value

            # After propagation, check which articles still need classification
            unprocessed_mask = existing_sdg_df["is_sustain"].isna()
            processed_ids = set(existing_sdg_df.loc[~unprocessed_mask, "article_uuid"])
            unprocessed_existing = existing_sdg_df.loc[unprocessed_mask]
        else:
            # If the column doesn't exist yet, consider all articles as unprocessed
            processed_ids = set()
            unprocessed_existing = existing_sdg_df

        print(f"Found {len(processed_ids)} previously classified articles.")
        print(
            f"Found {len(unprocessed_existing)} existing articles with missing SDG classification."
        )
    else:
        existing_sdg_df = pd.DataFrame()
        processed_ids = set()
        unprocessed_existing = pd.DataFrame()
        print("No previously classified articles found.")

    # Step 3: Process only articles that still need classification
    # Get unique articles that need processing (no need to process duplicates)
    if not unprocessed_existing.empty:
        articles_to_process = unprocessed_existing.drop_duplicates(
            subset="article_uuid", keep="first"
        )

        if not articles_to_process.empty:
            print(
                f"Classifying SDG relevance for {len(articles_to_process)} research articles..."
            )
            articles_to_process = determine.classify_sdg_relevance(articles_to_process)
            print("Categorizing SDG")
            articles_to_process = determine.determine_relevant_goals(
                articles_to_process
            )

            # Create a mapping of classification results by article_uuid
            classification_map = {}
            for _, row in articles_to_process.iterrows():
                article_id = row["article_uuid"]
                classification_map[article_id] = {
                    "is_sustain": row["is_sustain"],
                    "top 1": row.get("top 1", 0),
                    "top 2": row.get("top 2", 0),
                    "top 3": row.get("top 3", 0),
                }

            # Apply classifications to all instances of the articles in existing_sdg_df
            for article_id, values in classification_map.items():
                existing_sdg_df.loc[
                    existing_sdg_df["article_uuid"] == article_id,
                    ["is_sustain", "top 1", "top 2", "top 3"],
                ] = [
                    values["is_sustain"],
                    values["top 1"],
                    values["top 2"],
                    values["top 3"],
                ]

    # Save the updated dataframe
    existing_sdg_df.to_csv(sdg_file, index=False)
    print(f"Updated SDG classifications saved to '{sdg_file}'.")
    print(
        f"Total articles in SDG classifications: {len(existing_sdg_df.drop_duplicates(subset='article_uuid'))}"
    )


def main():
    print("=== Incremental Update Pipeline ===")
    # Step 1: Update merged faculty data (only new faculty entries will be appended)
    merged_df = update_merged_faculty()
    # Step 2: Update research outputs (append only new articles)
    research_df = update_research_outputs()
    # Step 3: Update SDG classification (only process articles that are new)
    update_sdg_classifications()
    # Step 4: Update articles
    data.add_journal_rankings("person_research_outputs.csv", "journals.xlsx")
    print("=== Incremental Update Complete ===")


if __name__ == "__main__":
    main()
