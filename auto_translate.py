#!/usr/bin/env python3
"""
Translate all [ES] and [FR] placeholders to proper Spanish and French
"""

# Common term translations
SPANISH_DICT = {
    # Actions
    'Generate': 'Generar',
    'Create': 'Crear',
    'Upload': 'Subir',
    'Download': 'Descargar',
    'Save': 'Guardar',
    'Delete': 'Eliminar',
    'Edit': 'Editar',
    'Add': 'Añadir',
    'Remove': 'Eliminar',
    'Update': 'Actualizar',
    'Export': 'Exportar',
    'Import': 'Importar',
    'Copy': 'Copiar',
    'Paste': 'Pegar',
    'Select': 'Seleccionar',
    'Choose': 'Elegir',
    'Click': 'Clic',
    'Submit': 'Enviar',
    'Cancel': 'Cancelar',
    'Confirm': 'Confirmar',
    'Continue': 'Continuar',
    'Back': 'Atrás',
    'Next': 'Siguiente',
    'Finish': 'Finalizar',
    'Close': 'Cerrar',
    'Open': 'Abrir',
    'View': 'Ver',
    'Preview': 'Vista previa',
    'Print': 'Imprimir',
    'Search': 'Buscar',
    'Filter': 'Filtrar',
    'Sort': 'Ordenar',
    
    # Tools & Features
    'Manager': 'Gestor',
    'Optimizer': 'Optimizador',
    'Calculator': 'Calculadora',
    'Simulator': 'Simulador',
    'Generator': 'Generador',
    'Analyzer': 'Analizador',
    'Tool': 'Herramienta',
    'Feature': 'Característica',
    'Dashboard': 'Panel',
    'Report': 'Informe',
    'Summary': 'Resumen',
    'Details': 'Detalles',
    'Settings': 'Configuración',
    'Options': 'Opciones',
    'Preferences': 'Preferencias',
    'Profile': 'Perfil',
    'Account': 'Cuenta',
    'User': 'Usuario',
    'Admin': 'Administrador',
    
    # Business & Finance
    'ROI': 'ROI',
    'Revenue': 'Ingresos',
    'Profit': 'Beneficio',
    'Loss': 'Pérdida',
    'Income': 'Ingreso',
    'Expense': 'Gasto',
    'Tax': 'Impuesto',
    'Price': 'Precio',
    'Cost': 'Costo',
    'Budget': 'Presupuesto',
    'Forecast': 'Previsión',
    'Projection': 'Proyección',
    'Analysis': 'Análisis',
    'Performance': 'Rendimiento',
    'Growth': 'Crecimiento',
    'Occupancy': 'Ocupación',
    'Booking': 'Reserva',
    'Guest': 'Huésped',
    'Host': 'Anfitrión',
    'Property': 'Propiedad',
    'Listing': 'Anuncio',
    'Review': 'Reseña',
    'Rating': 'Calificación',
    'Commission': 'Comisión',
    'Fee': 'Tarifa',
    
    # Common phrases
    'Professional': 'Profesional',
    'Advanced': 'Avanzado',
    'Basic': 'Básico',
    'Premium': 'Premium',
    'Standard': 'Estándar',
    'Custom': 'Personalizado',
    'Automatic': 'Automático',
    'Manual': 'Manual',
    'Quick': 'Rápido',
    'Detailed': 'Detallado',
    'Complete': 'Completo',
    'Partial': 'Parcial',
    'Full': 'Completo',
    'Empty': 'Vacío',
    'Active': 'Activo',
    'Inactive': 'Inactivo',
    'Enabled': 'Habilitado',
    'Disabled': 'Deshabilitado',
    'Available': 'Disponible',
    'Unavailable': 'No disponible',
    'Online': 'En línea',
    'Offline': 'Sin conexión',
    'Loading': 'Cargando',
    'Saving': 'Guardando',
    'Saved': 'Guardado',
    'Error': 'Error',
    'Success': 'Éxito',
    'Warning': 'Advertencia',
    'Info': 'Información',
    'Required': 'Requerido',
    'Optional': 'Opcional',
    'Yes': 'Sí',
    'No': 'No',
    'All': 'Todo',
    'None': 'Ninguno',
    'Other': 'Otro',
    'New': 'Nuevo',
    'Old': 'Antiguo',
    'Current': 'Actual',
    'Previous': 'Anterior',
    'First': 'Primero',
    'Last': 'Último',
    'Total': 'Total',
    'Average': 'Promedio',
    'Minimum': 'Mínimo',
    'Maximum': 'Máximo',
    
    # Time
    'Month': 'Mes',
    'Year': 'Año',
    'Day': 'Día',
    'Week': 'Semana',
    'Hour': 'Hora',
    'Minute': 'Minuto',
    'Second': 'Segundo',
    'Date': 'Fecha',
    'Time': 'Hora',
    'Today': 'Hoy',
    'Yesterday': 'Ayer',
    'Tomorrow': 'Mañana',
    'Now': 'Ahora',
    'Later': 'Más tarde',
    'Soon': 'Pronto',
    'Recent': 'Reciente',
    
    # Descriptions
    'Description': 'Descripción',
    'Name': 'Nombre',
    'Title': 'Título',
    'Subtitle': 'Subtítulo',
    'Label': 'Etiqueta',
    'Note': 'Nota',
    'Comment': 'Comentario',
    'Message': 'Mensaje',
    'Notification': 'Notificación',
    'Alert': 'Alerta',
    'Tip': 'Consejo',
    'Help': 'Ayuda',
    'Guide': 'Guía',
    'Tutorial': 'Tutorial',
    'Example': 'Ejemplo',
    'Template': 'Plantilla',
}

FRENCH_DICT = {
    # Actions
    'Generate': 'Générer',
    'Create': 'Créer',
    'Upload': 'Télécharger',
    'Download': 'Télécharger',
    'Save': 'Enregistrer',
    'Delete': 'Supprimer',
    'Edit': 'Modifier',
    'Add': 'Ajouter',
    'Remove': 'Retirer',
    'Update': 'Mettre à jour',
    'Export': 'Exporter',
    'Import': 'Importer',
    'Copy': 'Copier',
    'Paste': 'Coller',
    'Select': 'Sélectionner',
    'Choose': 'Choisir',
    'Click': 'Cliquer',
    'Submit': 'Soumettre',
    'Cancel': 'Annuler',
    'Confirm': 'Confirmer',
    'Continue': 'Continuer',
    'Back': 'Retour',
    'Next': 'Suivant',
    'Finish': 'Terminer',
    'Close': 'Fermer',
    'Open': 'Ouvrir',
    'View': 'Voir',
    'Preview': 'Aperçu',
    'Print': 'Imprimer',
    'Search': 'Rechercher',
    'Filter': 'Filtrer',
    'Sort': 'Trier',
    
    # Tools & Features
    'Manager': 'Gestionnaire',
    'Optimizer': 'Optimiseur',
    'Calculator': 'Calculatrice',
    'Simulator': 'Simulateur',
    'Generator': 'Générateur',
    'Analyzer': 'Analyseur',
    'Tool': 'Outil',
    'Feature': 'Fonctionnalité',
    'Dashboard': 'Tableau de bord',
    'Report': 'Rapport',
    'Summary': 'Résumé',
    'Details': 'Détails',
    'Settings': 'Paramètres',
    'Options': 'Options',
    'Preferences': 'Préférences',
    'Profile': 'Profil',
    'Account': 'Compte',
    'User': 'Utilisateur',
    'Admin': 'Administrateur',
    
    # Business & Finance
    'ROI': 'ROI',
    'Revenue': 'Revenus',
    'Profit': 'Bénéfice',
    'Loss': 'Perte',
    'Income': 'Revenu',
    'Expense': 'Dépense',
    'Tax': 'Taxe',
    'Price': 'Prix',
    'Cost': 'Coût',
    'Budget': 'Budget',
    'Forecast': 'Prévision',
    'Projection': 'Projection',
    'Analysis': 'Analyse',
    'Performance': 'Performance',
    'Growth': 'Croissance',
    'Occupancy': 'Occupation',
    'Booking': 'Réservation',
    'Guest': 'Invité',
    'Host': 'Hôte',
    'Property': 'Propriété',
    'Listing': 'Annonce',
    'Review': 'Avis',
    'Rating': 'Note',
    'Commission': 'Commission',
    'Fee': 'Frais',
    
    # Common phrases
    'Professional': 'Professionnel',
    'Advanced': 'Avancé',
    'Basic': 'Basique',
    'Premium': 'Premium',
    'Standard': 'Standard',
    'Custom': 'Personnalisé',
    'Automatic': 'Automatique',
    'Manual': 'Manuel',
    'Quick': 'Rapide',
    'Detailed': 'Détaillé',
    'Complete': 'Complet',
    'Partial': 'Partiel',
    'Full': 'Complet',
    'Empty': 'Vide',
    'Active': 'Actif',
    'Inactive': 'Inactif',
    'Enabled': 'Activé',
    'Disabled': 'Désactivé',
    'Available': 'Disponible',
    'Unavailable': 'Indisponible',
    'Online': 'En ligne',
    'Offline': 'Hors ligne',
    'Loading': 'Chargement',
    'Saving': 'Enregistrement',
    'Saved': 'Enregistré',
    'Error': 'Erreur',
    'Success': 'Succès',
    'Warning': 'Avertissement',
    'Info': 'Information',
    'Required': 'Requis',
    'Optional': 'Optionnel',
    'Yes': 'Oui',
    'No': 'Non',
    'All': 'Tout',
    'None': 'Aucun',
    'Other': 'Autre',
    'New': 'Nouveau',
    'Old': 'Ancien',
    'Current': 'Actuel',
    'Previous': 'Précédent',
    'First': 'Premier',
    'Last': 'Dernier',
    'Total': 'Total',
    'Average': 'Moyenne',
    'Minimum': 'Minimum',
    'Maximum': 'Maximum',
}

def translate_text(text, lang_dict):
    """Simple word-by-word translation for common terms."""
    words = text.split()
    translated = []
    for word in words:
        clean_word = word.strip('.,!?()[]{}')
        if clean_word in lang_dict:
            translated.append(lang_dict[clean_word])
        else:
            translated.append(word)
    return ' '.join(translated)

def process_file(filepath, lang_dict, marker):
    """Process translation file and translate placeholders."""
    with open(filepath, 'r') as f:
        lines = f.readlines()
    
    updated = 0
    for i, line in enumerate(lines):
        if f'{marker}]' in line and "': '" in line:
            # Extract the value
            parts = line.split("': '")
            if len(parts) == 2:
                key_part = parts[0]
                value_part = parts[1].rstrip("',\n")
                
                # Remove marker and translate
                value_part = value_part.replace(f'[{marker}] ', '').replace(f'[{marker}]', '')
                translated = translate_text(value_part, lang_dict)
                
                lines[i] = f"{key_part}': '{translated}',\n"
                updated += 1
    
    with open(filepath, 'w') as f:
        f.writelines(lines)
    
    return updated

if __name__ == '__main__':
    print("🔄 Translating placeholder values...\n")
    
    es_count = process_file('src/services/translations/es/ui.ts', SPANISH_DICT, 'ES')
    print(f"✅ Spanish: Updated {es_count} translations")
    
    fr_count = process_file('src/services/translations/fr/ui.ts', FRENCH_DICT, 'FR')
    print(f"✅ French: Updated {fr_count} translations")
    
    print(f"\n📊 Total: {es_count + fr_count} translations updated")
    print("\n⚠️  Note: Auto-translation is basic. Professional review recommended.")
