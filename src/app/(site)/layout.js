import { TooltipProvider } from "@src/components/ui/tooltip";
import LayoutWrapper from "../components/LayoutWrapper";

export default function SiteLayout({ children }) {
  return (
    <TooltipProvider>
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </TooltipProvider>
  )
}