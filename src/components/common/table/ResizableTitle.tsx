import React, { useCallback } from 'react';
import { Resizable } from 'react-resizable';

type ResizableTitleProps = React.ThHTMLAttributes<HTMLTableCellElement> & {
    onResize?: (e: React.SyntheticEvent, data: { size: { width: number } }) => void;
    width?: number;
    minWidth?: number;
    isLast?: boolean;
    maxWidth?: number;
};

const ResizableTitle: React.FC<ResizableTitleProps> = ({
    onResize,
    width,
    minWidth = 80,
    maxWidth,
    isLast,
    ...restProps
}) => {
    const handleClick = useCallback((e: React.MouseEvent) => {
        e.stopPropagation();
    }, []);

    if (!width) return <th {...restProps} />;

    const minConstraints: [number, number] = [Math.max(minWidth, 40), 0];
    const maxConstraints: [number, number] | undefined =
        typeof maxWidth === 'number' ? [Math.max(maxWidth, minConstraints[0]), 0] : undefined;

    return (
        <Resizable
            width={width}
            height={0}
            onResize={onResize}
            minConstraints={minConstraints}
            {...(maxConstraints ? { maxConstraints } : {})}
            draggableOpts={{ enableUserSelectHack: false }}
            handle={
                isLast ? (
                    <span className="none" onClick={handleClick} />
                ) : (
                    <span className="react-resizable-handle" onClick={handleClick} />
                )
            }
        >
            <th
                {...restProps}
                style={{
                    ...(restProps.style || {}),
                    minWidth: minWidth,
                    width,
                }}
            />
        </Resizable>
    );
};

export default ResizableTitle;
