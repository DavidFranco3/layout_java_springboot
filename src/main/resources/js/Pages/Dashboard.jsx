
import ContainerLaravel from '@/Components/Generales/ContainerLaravel';
import Authenticated from "@/Layouts/AuthenticatedLayout";
import React from "react";
import AuthDebug from '@/Components/Debug/AuthDebug';
import useAuth from "@/hooks/useAuth";

export default function Dashboard(props) {
    const { auth, errors, configuracions } = props;
    const { user } = useAuth();
    return (
        <Authenticated
            auth={auth}
            errors={errors}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <div className="col-lg-12 d-flex justify-content-center">
                <div className="col-lg-12 col-lg-offset-1 mt-2">
                    <ContainerLaravel
                        titulo={"Dashboard"}
                        icono={"fa-list"}
                    >
                        <div className="text-center p-4">
                            <h3>¡Bienvenido al Sistema!</h3>
                            <p>Utiliza el menú lateral para navegar por las diferentes secciones.</p>
                        </div>
                        {/* Debug info - Solo en desarrollo */}
                        {process.env.NODE_ENV === 'development' && user && (
                            <AuthDebug />
                        )}
                    </ContainerLaravel>
                </div>
            </div>
        </Authenticated>
    );
}
