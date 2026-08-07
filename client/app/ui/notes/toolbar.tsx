import { ToolbarButton } from "../buttons/button"

type Props = {
 
}
export const Toolbar = ({}: Props) => {
    return (
        <ul className="self-start m-0 flex flex-row uppercase gap-2">
            <li>
                <ToolbarButton>
                    <b>B</b>
                </ToolbarButton>
            </li>
            <li>
                <ToolbarButton>
                    <i>I</i>
                </ToolbarButton>
            </li>
            <li>
                <ToolbarButton>
                    <u>U</u>
                </ToolbarButton>
            </li>
            <li className="line-through">
                <ToolbarButton>
                    ab
                </ToolbarButton>
            </li>
        </ul>
    );
}