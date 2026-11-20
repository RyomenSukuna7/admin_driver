import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { colors } from '../../theme';
import { busStore, emptyStudents } from '../data/busStore';

const PLACEHOLDER = '#94a3b8';

// Text input that turns teal with a soft ring while it has focus
function Field({ style, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <TextInput
      placeholderTextColor={PLACEHOLDER}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[styles.input, focused && styles.inputFocused, style]}
      {...props}
    />
  );
}

export default function BusFormScreen({ mode = 'enter' }) {
  const isUpdate = mode === 'update';

  const [driverName, setDriverName] = useState(busStore.driverName);
  const [students, setStudents] = useState(busStore.students);

  const filledCount = students.filter((s) => s.name.trim() !== '').length;

  const updateStudent = (index, field, value) => {
    setStudents((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
    );
  };

  const clearAll = () => {
    setDriverName('');
    setStudents(emptyStudents());
  };

  const save = () => {
    busStore.driverName = driverName.trim();
    busStore.students = students;
    Alert.alert(
      isUpdate ? 'Changes saved' : 'Bus details saved',
      `Driver: ${driverName.trim() || '-'}\nStudents with names: ${filledCount}`
    );
  };

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient
        colors={[colors.navy, colors.navy2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.heroTop}>
          <View style={styles.heroIcon}>
            <Ionicons
              name={isUpdate ? 'pencil' : 'create-outline'}
              size={22}
              color="#fff"
            />
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Admin</Text>
          </View>
        </View>
        <Text style={styles.title}>
          {isUpdate ? 'Update details' : 'Enter bus details'}
        </Text>
        <Text style={styles.subtitle}>
          {isUpdate
            ? 'Edit the driver name and any student name or pickup location.'
            : 'Add the driver and every student with their pickup location.'}
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Driver card */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.cardTitleRow}>
              <View style={styles.sectionIcon}>
                <Ionicons name="person-outline" size={16} color={colors.navy2} />
              </View>
              <Text style={styles.cardTitle}>Driver</Text>
            </View>
            <Text style={styles.requiredTag}>Required</Text>
          </View>

          <View style={styles.cardBody}>
            <Text style={styles.label}>Full name</Text>
            <Field
              value={driverName}
              onChangeText={setDriverName}
              placeholder="e.g. Ramesh Kumar"
            />
          </View>
        </View>

        {/* Students card */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.cardTitleRow}>
              <View style={styles.sectionIcon}>
                <Ionicons name="people-outline" size={16} color={colors.navy2} />
              </View>
              <Text style={styles.cardTitle}>Students</Text>
            </View>
            <View style={styles.countChip}>
              <Text style={styles.countText}>
                {filledCount} of {students.length}
              </Text>
            </View>
          </View>

          <View style={styles.cardBody}>
            <View style={styles.colHeadRow}>
              <Text style={[styles.colHead, { flex: 1 }]}>Student name</Text>
              <Text style={[styles.colHead, { flex: 1 }]}>Pickup location</Text>
            </View>

            {students.map((student, index) => (
              <View
                key={index}
                style={[
                  styles.studentRow,
                  index === students.length - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.num}>
                  <Text style={styles.numText}>{index + 1}</Text>
                </View>
                <Field
                  style={styles.studentInput}
                  value={student.name}
                  onChangeText={(text) => updateStudent(index, 'name', text)}
                  placeholder="Student name"
                />
                <Field
                  style={styles.studentInput}
                  value={student.location}
                  onChangeText={(text) => updateStudent(index, 'location', text)}
                  placeholder="Pickup location"
                />
              </View>
            ))}

            <View style={styles.noteRow}>
              <Ionicons name="information-circle-outline" size={16} color={colors.muted} />
              <Text style={styles.note}>
                Leave a row empty if this bus has fewer students.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed action bar */}
      <View style={styles.actionBar}>
        {!isUpdate && (
          <Pressable
            onPress={clearAll}
            style={({ pressed }) => [styles.btnGhost, pressed && styles.pressed]}
          >
            <Ionicons name="refresh-outline" size={16} color={colors.ink} />
            <Text style={styles.btnGhostText}>Clear</Text>
          </Pressable>
        )}
        <Pressable
          onPress={save}
          style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
        >
          <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
          <Text style={styles.btnPrimaryText}>
            {isUpdate ? 'Save updates' : 'Save bus details'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  // Header
  hero: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 44,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  heroIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 999,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { color: '#fff', fontSize: 26, fontWeight: '800' },
  subtitle: { color: '#ffffffcc', fontSize: 14, marginTop: 6, lineHeight: 20 },

  // Scroll content
  scroll: { paddingHorizontal: 16, paddingTop: 0, paddingBottom: 24, gap: 16 },

  // Cards
  card: {
    backgroundColor: colors.card,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: colors.navy,
    shadowOpacity: 0.07,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
    marginTop: 16,
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  sectionIcon: {
    width: 30,
    height: 30,
    borderRadius: 9,
    backgroundColor: colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: colors.ink, fontSize: 16, fontWeight: '700' },
  requiredTag: {
    color: colors.teal,
    backgroundColor: colors.tealSoft,
    fontSize: 12,
    fontWeight: '700',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    overflow: 'hidden',
  },
  countChip: {
    backgroundColor: colors.tealSoft,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  countText: { color: colors.teal, fontSize: 12, fontWeight: '700' },
  cardBody: { padding: 18 },

  // Fields
  label: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  input: {
    height: 46,
    backgroundColor: '#f8fafc',
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.ink,
  },
  inputFocused: {
    borderColor: colors.teal,
    backgroundColor: '#fff',
  },

  // Students
  colHeadRow: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 46,
    marginBottom: 10,
  },
  colHead: {
    color: colors.muted,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  num: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: { color: colors.navy2, fontSize: 13, fontWeight: '800' },
  studentInput: { flex: 1, minWidth: 0, height: 42, fontSize: 14 },
  noteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
  },
  note: { color: colors.muted, fontSize: 12, flex: 1 },

  // Action bar
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 28,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  btnGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 48,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.line,
    backgroundColor: '#fff',
  },
  btnGhostText: { color: colors.ink, fontSize: 14, fontWeight: '700' },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.navy,
  },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.8 },
});