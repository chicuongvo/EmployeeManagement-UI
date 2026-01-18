import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React, { useMemo } from "react";
import { cn } from "@/lib/utils";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  loading?: boolean;
  color?: "green" | "orange" | "blue" | "red";
};

const CircleButton = ({
  children,
  icon,
  loading,
  className = "",
  color,
  disabled,
  ...props
}: Props) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    props.onClick?.(e);
  };

  const colorClasses = useMemo(() => {
    switch (color) {
      case "green":
        return "text-green";
      case "orange":
        return "text-orange";
      case "blue":
        return "text-blue";
      case "red":
        return "text-red";
    }
  }, [color]);

  return (
    <button
      {...props}
      onClick={handleClick}
      className={cn(
        `flex flex-col relative group overflow-hidden rounded-full px-6 py-1 duration-200 flex items-center justify-between gap-1 cursor-pointer ${disabled ? "cursor-not-allowed text-gray-300" : colorClasses
        }`,
        className
      )}
    >
      {loading ? (
        <Spin
          indicator={<LoadingOutlined className="text-primary-100" spin />}
          size="small"
        />
      ) : (
        icon
      )}
      {children}
      <span className="absolute inset-0 pointer-events-none z-10 rounded-md" />
    </button>
  );
};

export default CircleButton;
