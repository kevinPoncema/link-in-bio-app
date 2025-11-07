import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as SiIcons from 'react-icons/si';
import { LinkIcon } from 'lucide-react';

const DynamicIcon = ({ iconName, className = "w-5 h-5", style = {} }) => {
  if (!iconName) {
    // Icono por defecto si no hay icono especificado - usando FaLink
    const DefaultIcon = FaIcons.FaLink;
    return <DefaultIcon className={className} style={style} />;
  }

  // Mapeo de todas las librerías
  const iconLibraries = {
    ...FaIcons,
    ...SiIcons,
  };

  const IconComponent = iconLibraries[iconName];

  if (!IconComponent) {
    // Fallback si no se encuentra el icono - usando FaLink
    const FallbackIcon = FaIcons.FaLink;
    return <FallbackIcon className={className} style={style} />;
  }

  return <IconComponent className={className} style={style} />;
};

export default DynamicIcon;
