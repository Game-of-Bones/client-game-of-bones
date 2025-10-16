import React from 'react';
import CreatePostForm from '../components/forms/CreatePostForm'; 

/**
 * CreatePostPage - Contenedor para el formulario de creación de posts.
 * * NOTA DE CORRECCIÓN: Se eliminó la dependencia a "../../components/common/PageLayout" 
 * ya que ese módulo no fue encontrado en la estructura del proyecto.
 */
const CreatePostPage: React.FC = () => {
    return (
        // El estilo de fondo (min-h-screen) lo toma la página directamente
        <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)' }}>
            <CreatePostForm />
        </div>
    );
};

export default CreatePostPage;
