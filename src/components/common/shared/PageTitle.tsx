import React from "react";

interface PageTitleProps {
    title: string | React.ReactNode;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
    return (
        <h1 className="text-2xl font-bold text-gray-800">
            {title}
        </h1>
    );
};

export default PageTitle;
