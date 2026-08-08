import { TransformType, transformTypes } from "@/app/lib/definitions"
import { ToolbarButton } from "../buttons/button"


interface ToolbarProps {
    handleToolbarButtonClick: (transformType: TransformType) => () => void;
}

export const Toolbar = ({ handleToolbarButtonClick }: ToolbarProps) => {
    return (
        <ul className="self-start flex w-full flex-row uppercase pb-2 border-b-gray-600 border-b m-0">
            <li>
                <ToolbarButton onClick={handleToolbarButtonClick(transformTypes.BOLD)}>
                    <b>B</b>
                </ToolbarButton>
            </li>
            <li>
                <ToolbarButton onClick={handleToolbarButtonClick(transformTypes.ITALIC)}>
                    <i>I</i>
                </ToolbarButton>
            </li>
            <li>
                <ToolbarButton onClick={handleToolbarButtonClick(transformTypes.LINE_THROUGH)}>
                    <p className="m-0 p-0 line-through">ab</p>
                </ToolbarButton>
            </li>
        </ul>
    );
}