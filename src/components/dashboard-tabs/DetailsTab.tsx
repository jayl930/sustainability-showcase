
import { Article } from "@/utils/types";
import DetailsTable from "../DetailsTab";

interface DetailsTabProps {
  articles: Article[];
}

const DetailsTab = ({ articles }: DetailsTabProps) => {
  return <DetailsTable articles={articles} />;
};

export default DetailsTab;
