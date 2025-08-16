export const es = {
  // Header
  appTitle: "Planificador de Medicamentos",
  appSubtitle: "Registra tus medicamentos y nunca olvides una dosis",
  
  // Buttons
  addMedication: "Agregar Medicamento",
  import: "Importar",
  export: "Exportar",
  save: "Guardar",
  cancel: "Cancelar",
  delete: "Eliminar",
  clearAll: "Borrar Todo",
  close: "Cerrar",
  edit: "Editar",
  
  // Medication List
  yourMedications: "Tus Medicamentos",
  noMedicationsYet: "No hay medicamentos agregados aún. ¡Agrega tu primer medicamento para comenzar!",
  totalMedications: "Total de medicamentos",
  every: "Cada",
  hours: "horas",
  hour: "hora",
  startsAt: "Comienza a las",
  perDay: "/día",
  
  // Schedule Display
  twentyFourHourSchedule: "Horario de 24 Horas",
  scheduleWillAppear: "Tu horario de medicamentos aparecerá aquí una vez que agregues medicamentos.",
  firstDoseStartsAt: "Primera dosis comienza a las",
  totalDosesToday: "Dosis totales hoy",
  nextDayDoses: "Dosis del día siguiente",
  nextDay: "Día Siguiente",
  current: "Actual",
  now: "AHORA",
  
  // Add/Edit Medication Modal
  medicationName: "Nombre del Medicamento",
  medicationNamePlaceholder: "ej., Aspirina, Ibuprofeno",
  startTime: "Hora de Inicio",
  whenToTakeFirstDose: "Cuándo tomar la primera dosis",
  maxDosesPerDay: "Máximo de Dosis por Día",
  limitDailyDoses: "Limitar dosis diarias",
  dosingInterval: "Intervalo de Dosificación",
  everyFourHours: "Cada 4 horas",
  everySixHours: "Cada 6 horas",
  everyEightHours: "Cada 8 horas",
  everyTwelveHours: "Cada 12 horas",
  onceDaily: "Una vez al día",
  custom: "Personalizado",
  saveMedication: "Guardar Medicamento",
  editMedication: "Editar Medicamento",
  saveChanges: "Guardar Cambios",
  deleteMedication: "¿Eliminar Medicamento?",
  deleteConfirmation: "¿Estás seguro de que quieres eliminar",
  cannotBeUndone: "Esta acción no se puede deshacer.",
  
  // Import/Export Modal
  importSchedule: "Importar Horario",
  exportSchedule: "Exportar Horario",
  pasteJSON: "Pegar JSON",
  uploadFile: "Subir Archivo",
  pasteYourJSON: "Pega tus datos JSON aquí",
  paste: "Pegar",
  importData: "Importar Datos",
  loadSampleData: "Cargar Datos de Muestra",
  dropFileHere: "Suelta tu archivo JSON aquí o haz clic para buscar",
  chooseFile: "Elegir Archivo",
  acceptsJSON: "Acepta archivos .json exportados del Planificador de Medicamentos",
  importFormat: "Formato de Importación",
  importFormatDescription: "El archivo JSON debe contener tus medicamentos con sus horarios. Puedes exportar tu horario actual para ver el formato esperado, o usar los datos de muestra como referencia.",
  downloadJSON: "Descargar JSON",
  copyToClipboard: "Copiar al Portapapeles",
  exportDescription: "Exporta tu horario de medicamentos para compartir o respaldar",
  copiedToClipboard: "¡Copiado al portapapeles!",
  exportedSuccessfully: "¡Horario exportado exitosamente!",
  
  // Clear Confirmation Modal
  clearAllMedications: "¿Borrar Todos los Medicamentos?",
  clearConfirmation: "¿Estás seguro de que quieres eliminar todos los medicamentos de tu horario? Esta acción no se puede deshacer.",
  clearAllButton: "Borrar Todo",
  
  // Timeline Progress Bar
  nextDoseIn: "Próxima dosis en",
  noDosesScheduled: "No hay dosis programadas",
  todaysTimeline: "Línea de Tiempo de Hoy",
  
  // Validation Messages
  enterMedicationName: "Por favor ingresa un nombre de medicamento",
  enterValidInterval: "Por favor ingresa un intervalo válido entre 0 y 48 horas",
  enterValidMaxDoses: "Por favor ingresa un máximo de dosis válido entre 1 y 10",
  invalidJSONFormat: "Formato JSON inválido. Por favor revisa tus datos.",
  invalidDataFormat: "Formato de datos inválido",
  pleasePasteJSON: "Por favor pega datos JSON",
  
  // Success Messages
  medicationAdded: "Agregado",
  medicationUpdated: "Actualizado",
  medicationRemoved: "Eliminado",
  fromSchedule: "del horario",
  toSchedule: "al horario",
  imported: "Importado",
  medication: "medicamento",
  medications: "medicamentos",
  allMedicationsCleared: "Todos los medicamentos borrados",
  pastedFromClipboard: "Pegado desde el portapapeles",
  failedToReadClipboard: "Error al leer el portapapeles",
  
  // Time Display
  am: "AM",
  pm: "PM",
} as const;