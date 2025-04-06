import os
import pandas as pd
import json
import time
from tenacity import retry, stop_after_attempt, wait_exponential
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()
openai_api_key = os.getenv("OPENAI_API_KEY")
# ------------------------------
# PART 1: Sustainability Relevance Classification
# ------------------------------

from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from langchain_core.output_parsers.json import SimpleJsonOutputParser

# Initialize your LLM (update temperature/model parameters as needed)
llm = ChatOpenAI(
    # temperature=0,
    model_name="o3-mini",
    openai_api_key=openai_api_key,
)

sustain_question = """
Your task is to determine whether the following research title and abstract relate directly to any of the 17 United Nations Sustainable Development Goals (SDGs). 
Relevance requires that the research substantially contributes to or discusses sustainability goals, either through direct application or by providing foundational insights, tools, or frameworks that support the goals. 
If relevant, return 1; if not relevant, return 0.

The 17 UN Sustainable Development Goals (SDGs) and descriptions for articles are:
1. No Poverty: Research addressing economic inclusion, poverty eradication strategies, and financial empowerment of disadvantaged populations.
2. Zero Hunger: Studies focused on ending hunger, improving food security and nutrition, and promoting sustainable agriculture.
3. Good Health and Well-Being: Research promoting health and well-being for all ages, including disease prevention, healthcare access, and medical advancements.
4. Quality Education: Research on ensuring inclusive, equitable, and quality education, and promoting lifelong learning opportunities.
5. Gender Equality: Studies aiming to achieve gender equality, empower all women and girls, and address gender disparities.
6. Clean Water and Sanitation: Research ensuring availability and sustainable management of water resources and sanitation for all.
7. Affordable and Clean Energy: Studies on access to affordable, reliable, sustainable, and modern energy sources, including renewable energy technologies.
8. Decent Work and Economic Growth: Research focused on promoting inclusive and sustainable economic growth by creating quality, productive jobs and formalizing labour markets. Studies examine how investments in education, skills training, and financial inclusion can reduce informal employment and address inequalities—especially for youth and women—while ensuring safe, secure working environments. They also explore strategies for reforming financial systems and supporting entrepreneurship, thereby strengthening the social contract and boosting overall productivity in an increasingly uncertain global economy.
9. Industry, Innovation, and Infrastructure: Research examining how resilient and sustainable infrastructure investments—across transport, energy, water, and digital connectivity—drive inclusive industrialization and technological advancement. Studies explore how modern industrial policies, efficient resource use, and increased R&D spur innovation while reducing environmental impacts and inequalities, especially in developing regions.
10. Reduced Inequality: Research aimed at reducing inequalities within and among countries, including social, economic, and political disparities.
11. Sustainable Cities and Communities: Studies on making cities and human settlements inclusive, safe, resilient, and sustainable through urban planning and community development.
12. Responsible Consumption and Production: Research addressing how societies can transition to sustainable consumption and production patterns that minimize waste and conserve natural resources. Studies explore innovative strategies—such as circular economy models, sustainable supply chain management, eco-design, and waste reduction technologies—to decouple economic growth from environmental degradation. They also examine policy interventions, corporate sustainability reporting, and behavioral changes that promote efficient resource use, reduce food waste, and support lifestyles in harmony with nature, ensuring a better quality of life for current and future generations.
13. Climate Action: Studies taking urgent action to combat climate change and its impacts, including mitigation and adaptation strategies.
14. Life Below Water: Research on conserving and sustainably using oceans, seas, and marine resources for sustainable development.
15. Life on Land: Studies focused on protecting, restoring, and promoting sustainable use of terrestrial ecosystems, forests, and biodiversity.
16. Peace, Justice, and Strong Institutions: Research promoting peaceful, inclusive societies by strengthening the rule of law, reducing violence, and ensuring universal access to justice. Studies investigate how accountable, transparent, and effective institutions, along with anti-corruption measures and participatory governance, lay the foundation for social stability and sustainable development.
17. Partnerships for the Goals: Research focused on revitalizing global partnerships by enhancing international cooperation, resource mobilization, and capacity-building. Studies analyze how multistakeholder collaboration among governments, the private sector, and civil society—through technology transfer, knowledge sharing, and policy coherence—can accelerate progress toward all Sustainable Development Goals.
    
Research Title and Abstract:
{string}

Please analyze the research title and abstract to determine if it relates to any of the SDGs. Focus on direct contributions to sustainability goals. Avoid over-strict exclusion while maintaining meaningful relevance. Do not provide any reasoning in your response. Only respond in the following structured JSON format:

{{"result": 1}}  // For relevance to any SDG
{{"result": 0}}  // For non-relevance
"""

system_template = (
    "You are an sustainability expert specializing in assessing the relevance of research "
    "to the United Nations Sustainable Development Goals (SDGs). Given a research title and abstract, "
    "your task is to determine if the research relates to any of the 17 SDGs. Your response should "
    "be in JSON format as specified."
)

prompt_template = ChatPromptTemplate.from_messages(
    [("system", system_template), ("user", "{question}")]
)

parser = SimpleJsonOutputParser()

chain = prompt_template | llm | parser


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def invoke_with_retry(chain, question):
    try:
        return chain.invoke({"question": question})
    except Exception as e:
        print(f"Attempt failed: {str(e)}")
        raise


def classify_sdg_relevance(df):
    """
    Iterates through the DataFrame (which must contain 'title' and 'abstract' columns)
    and adds an "is_sustain" column with 1 for relevance and 0 for non-relevance.
    """
    results = []
    for index, row in df.iterrows():
        try:
            title = row["title"]
            abstract = row["abstract"]
            research_string = f"title: {title}\nabstract: {abstract}"
            question = sustain_question.format(string=research_string)
            time.sleep(1)
            try:
                output = invoke_with_retry(chain, question)
                if isinstance(output, dict):
                    result = int(output.get("result", 0))
                elif isinstance(output, str):
                    try:
                        result_dict = json.loads(output)
                        result = int(result_dict.get("result", 0))
                    except json.JSONDecodeError:
                        result = 0
                else:
                    result = 0
                results.append(result)
            except Exception as e:
                results.append(0)
        except Exception as e:
            results.append(0)
    df["is_sustain"] = results
    return df


# ------------------------------
# PART 2: Determine Specific SDG Goals Using FAISS and a Second Prompt
# ------------------------------

import getpass
from dotenv import load_dotenv
from langchain_community.vectorstores import FAISS
from langchain_openai import OpenAIEmbeddings

# Load environment variables if needed
load_dotenv()

if not os.getenv("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = getpass.getpass("Enter your OpenAI API key: ")

embeddings = OpenAIEmbeddings(
    model="text-embedding-3-large",
    openai_api_key="",
)

loaded_faiss = FAISS.load_local(
    "faiss_sustainability_goals", embeddings, allow_dangerous_deserialization=True
)

goal_prompt = """
You are an expert in sustainability research alignment. Given the following research article and a list of candidate United Nations Sustainable Development Goals (SDGs) with their full descriptions, determine which of these goals are truly relevant to the research.
Select the most relevant goal as "top 1", then the next most relevant as "top 2", and then the next as "top 3". If fewer than three goals are relevant, only output those that are applicable.
Return your answer in JSON format with the key "goals" mapping to a list of goal numbers (for example: {{"goals": [1, 10, 12]}}). Do not include any additional explanation.

Research Article:
{research_text}

Candidate SDG Goals:
{candidate_goals}
"""

goal_system_template = (
    "You are a sustainability expert. Given a research article and candidate SDG goals, "
    "identify the top relevant goals in order of importance."
)

goal_prompt_template = ChatPromptTemplate.from_messages(
    [("system", goal_system_template), ("user", goal_prompt)]
)

goal_parser = SimpleJsonOutputParser()
goal_chain = goal_prompt_template | llm | goal_parser


@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
def invoke_goal_chain_with_retry(chain, research_text, candidate_goals):
    try:
        return chain.invoke(
            {"research_text": research_text, "candidate_goals": candidate_goals}
        )
    except Exception as e:
        print(f"Goal chain attempt failed: {str(e)}")
        raise


def determine_relevant_goals(df):
    """
    For each article marked as sustainable (is_sustain == 1), determine the top relevant SDG goals.
    The results are added as new columns: "top 1", "top 2", and "top 3".
    """
    top1_list = []
    top2_list = []
    top3_list = []
    for index, row in df.iterrows():
        if row["is_sustain"] == 1:
            try:
                title = row["title"]
                abstract = row["abstract"]
                research_text = f"title: {title}\nabstract: {abstract}"
                results = loaded_faiss.similarity_search_with_score(research_text, k=5)
                candidate_goals_entries = []
                for doc, score in results:
                    goal_number = doc.metadata.get("goal_number")
                    if goal_number is not None:
                        entry = f"Goal {goal_number}: {doc.page_content}"
                        candidate_goals_entries.append(entry)
                candidate_goals = "\n\n".join(candidate_goals_entries)
                time.sleep(1)
                output = invoke_goal_chain_with_retry(
                    goal_chain, research_text, candidate_goals
                )
                selected_goals = []
                if isinstance(output, dict) and "goals" in output:
                    selected_goals = output["goals"]
                elif isinstance(output, str):
                    try:
                        result_dict = json.loads(output)
                        selected_goals = result_dict.get("goals", [])
                    except json.JSONDecodeError:
                        selected_goals = []
                if not isinstance(selected_goals, list):
                    selected_goals = []
                top1 = selected_goals[0] if len(selected_goals) > 0 else 0
                top2 = selected_goals[1] if len(selected_goals) > 1 else 0
                top3 = selected_goals[2] if len(selected_goals) > 2 else 0
                top1_list.append(top1)
                top2_list.append(top2)
                top3_list.append(top3)
            except Exception as e:
                top1_list.append(0)
                top2_list.append(0)
                top3_list.append(0)
        else:
            top1_list.append(0)
            top2_list.append(0)
            top3_list.append(0)
    df["top 1"] = top1_list
    df["top 2"] = top2_list
    df["top 3"] = top3_list
    return df


# if __name__ == "__main__":
#     # Example usage: process a CSV file with columns "title" and "abstract"
#     # Uncomment and modify the lines below as needed.
#     # df = pd.read_csv("your_articles.csv")
#     # df = classify_sdg_relevance(df)
#     # df = determine_relevant_goals(df)
#     # df.to_csv("your_articles_with_sdg.csv", index=False)
#     pass
