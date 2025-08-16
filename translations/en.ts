export const en = {
  // Header
  appTitle: "Medication Scheduler",
  appSubtitle: "Track your medications and never miss a dose",
  
  // Buttons
  addMedication: "Add Medication",
  import: "Import",
  export: "Export",
  save: "Save",
  cancel: "Cancel",
  delete: "Delete",
  clearAll: "Clear",
  close: "Close",
  edit: "Edit",
  
  // Medication List
  yourMedications: "Medications",
  noMedicationsYet: "No medications added yet. Add your first medication to get started!",
  totalMedications: "Total medications",
  every: "Every",
  hours: "hours",
  hour: "hour",
  startsAt: "Starts at",
  perDay: "/day",
  
  // Schedule Display
  twentyFourHourSchedule: "24-Hour Schedule",
  scheduleWillAppear: "Your medication schedule will appear here once you add medications.",
  firstDoseStartsAt: "First dose starts at",
  totalDosesToday: "Total doses today",
  nextDayDoses: "Next day doses",
  nextDay: "Next Day",
  current: "Current",
  now: "NOW",
  
  // Add/Edit Medication Modal
  medicationName: "Medication Name",
  medicationNamePlaceholder: "e.g., Aspirin, Ibuprofen",
  startTime: "Start Time",
  whenToTakeFirstDose: "When to take the first dose",
  maxDosesPerDay: "Max Doses Per Day",
  limitDailyDoses: "Limit daily doses",
  dosingInterval: "Dosing Interval",
  everyFourHours: "Every 4 hours",
  everySixHours: "Every 6 hours",
  everyEightHours: "Every 8 hours",
  everyTwelveHours: "Every 12 hours",
  onceDaily: "Once daily",
  custom: "Custom",
  saveMedication: "Save",
  editMedication: "Edit Medication",
  saveChanges: "Save",
  deleteMedication: "Delete Medication?",
  deleteConfirmation: "Are you sure you want to delete",
  cannotBeUndone: "This action cannot be undone.",
  
  // Import/Export Modal
  importSchedule: "Import Schedule",
  exportSchedule: "Export Schedule",
  pasteJSON: "Paste JSON",
  uploadFile: "Upload File",
  pasteYourJSON: "Paste your JSON data here",
  paste: "Paste",
  importData: "Import",
  loadSampleData: "Load Sample Data",
  dropFileHere: "Drop your JSON file here or click to browse",
  chooseFile: "Choose File",
  acceptsJSON: "Accepts .json files exported from Medication Scheduler",
  importFormat: "Import Format",
  importFormatDescription: "The JSON file should contain your medications with their schedules. You can export your current schedule to see the expected format, or use the sample data as a reference.",
  downloadJSON: "Download",
  copyToClipboard: "Copy",
  exportDescription: "Export your medication schedule to share or backup",
  copiedToClipboard: "Copied to clipboard!",
  exportedSuccessfully: "Schedule exported successfully!",
  
  // Clear Confirmation Modal
  clearAllMedications: "Clear All Medications?",
  clearConfirmation: "Are you sure you want to remove all medications from your schedule? This action cannot be undone.",
  clearAllButton: "Clear",
  
  // Timeline Progress Bar
  nextDoseIn: "Next dose in",
  noDosesScheduled: "No doses scheduled",
  todaysTimeline: "Today's Timeline",
  
  // Validation Messages
  enterMedicationName: "Please enter a medication name",
  enterValidInterval: "Please enter a valid interval between 0 and 48 hours",
  enterValidMaxDoses: "Please enter a valid max doses between 1 and 10",
  invalidJSONFormat: "Invalid JSON format. Please check your data.",
  invalidDataFormat: "Invalid data format",
  pleasePasteJSON: "Please paste JSON data",
  
  // Success Messages
  medicationAdded: "Added",
  medicationUpdated: "Updated",
  medicationRemoved: "Removed",
  fromSchedule: "from schedule",
  toSchedule: "to schedule",
  imported: "Imported",
  medication: "medication",
  medications: "medications",
  allMedicationsCleared: "All medications cleared",
  pastedFromClipboard: "Pasted from clipboard",
  failedToReadClipboard: "Failed to read clipboard",
  
  // Time Display
  am: "AM",
  pm: "PM",
  selectTime: "Select Time",
  confirm: "Confirm",
  
  // Timeline Labels
  completed: "Completed",
  next: "Next",
  upcoming: "Upcoming",
  
  // Footer
  footerLine1: "Remember to consult with your healthcare provider about your medication schedule.",
  footerLine2: "This tool is for organizational purposes only and does not replace professional medical advice.",
} as const;

export type TranslationKey = keyof typeof en;