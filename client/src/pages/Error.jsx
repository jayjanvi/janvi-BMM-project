import React from "react";

function ErrorPage() {
    return (
        <>
            <div className="error-container">
                <h1 className="error-title">Oops! <br></br>404 Error Page</h1>
                <p className="error-message">This URL is not found</p>
                {/* You can add additional elements or navigation links here */}
            </div>
        </>
    )
}
export default ErrorPage;