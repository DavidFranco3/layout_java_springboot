import React from "react";

const ContainerLTE = React.memo(({children,title,buttonadd}) => {
    return (
        <div className="col-md-12 p-3">
            <div className="card card-primary card-outline">
                <div className="card-header">
                    <h3 className="card-title text-md" >
                        {title}
                    </h3>
                    <span className="float-end">{buttonadd}</span>
                </div>
                <div className="card-body">
                    {children}
                </div>
            </div>
        </div>
    );
});

export default ContainerLTE;
