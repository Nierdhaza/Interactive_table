interface SortIconProps {
    active: boolean;
    ascending: boolean;
}

const arrowUp = <path d="M4 0L0 4h8L4 0z" fill="currentColor" />;
const arrowDown = <path d="M4 10L0 6h8l-4 4z" fill="currentColor" />;

export default function SortIcon({
    active,
    ascending,
}: SortIconProps) {
    let path = null;

    switch (true) {
        case !active:
            path = (
                <>
                    {arrowUp}
                    {arrowDown}
                </>
            );
            break;
        case ascending: 
            path = arrowUp
            break;
        case !ascending:
            path = arrowDown;
    }

    return (
        <svg width="8" height="12" viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg">
            <g transform="translate(0, 2)">
                {path}
            </g>
        </svg>
    )
};
