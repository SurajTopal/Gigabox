import { StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { COLORS } from '../../utils/colors';

type Styles = {
  container:ViewStyle;
  content:ViewStyle;
  profileHeader:ViewStyle;
  avatar:ViewStyle;
  avatarText:TextStyle;
  profileInfo:ViewStyle;
  profileName:TextStyle;
  profileEmail:TextStyle;
  editButton:ViewStyle;
  editButtonText:TextStyle;
  statsContainer:ViewStyle;
  statBox:ViewStyle;
  statValue:TextStyle;
  statLabel:TextStyle;
  section:ViewStyle;
  sectionTitle:TextStyle;
  inputGroup:ViewStyle;
  label:TextStyle;
  input:TextStyle;
  textAreaInput:TextStyle;
  buttonGroup:ViewStyle;
  detailBox:ViewStyle;
  detailRow:ViewStyle;
  detailLabel:TextStyle;
  detailValue:TextStyle;
  divider:ViewStyle;
  linkBox:ViewStyle;
  linkBoxMargin:ViewStyle;
  linkIcon:TextStyle;
  linkInfo:ViewStyle;
  linkTitle:TextStyle;
  linkSubtitle:TextStyle;
  linkArrow:TextStyle;
  settingRow:ViewStyle;
  settingRowBorder:ViewStyle;
  settingLabel:TextStyle;
  settingToggle:TextStyle;
  appInfo:ViewStyle;
  appInfoText:TextStyle;
  appInfoSubtext:TextStyle;
};


export const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Profile Header
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 12,
    color: '#6b7280',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 20,
  },

  // Stats
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },

  // Edit Form
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: COLORS.text,
  },
  textAreaInput: {
    minHeight: 100,
    paddingTop: 10,
  },
  buttonGroup: {
    marginTop: 20,
  },

  // Detail Box
  detailBox: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    elevation: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: '500',
    width:200,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },

  // Quick Links
  linkBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  linkBoxMargin: {
    marginTop: 12,
  },
  linkIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 2,
  },
  linkSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  linkArrow: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: 'bold',
  },

  // Settings
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  settingRowBorder: {
    borderBottomWidth: 0,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.text,
  },
  settingToggle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.primary,
  },

  // App Info
  appInfo: {
    alignItems: 'center',
    marginVertical: 30,
  },
  appInfoText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
    marginBottom: 4,
  },
  appInfoSubtext: {
    fontSize: 11,
    color: '#d1d5db',
  },
});
