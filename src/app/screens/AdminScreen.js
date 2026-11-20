import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { colors } from '../../theme';

const STUDENT_COUNT = 8;
const FIELD_BG = '#f8fafc';
const PLACEHOLDER = '#94a3b8';
const NUM_BG = '#e8eef6';

const emptyStudents = () =>
  Array.from({ length: STUDENT_COUNT }, () => ({ name: '', location: '' }));

export default function AdminScreen() {
  const [driverName, setDriverName] = useState('');
  const [students, setStudents] = useState(emptyStudents);

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
    const count = students.filter((s) => s.name.trim() !== '').length;
    Alert.alert(
      'Bus details saved',
      `Driver: ${driverName.trim() || '-'}\nStudents: ${count}`
    );
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />

      <LinearGradient
        colors={[colors.navy, colors.navy2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <Text style={styles.eyebrow}>Admin</Text>
        <Text style={styles.title}>Enter bus details</Text>
        <Text style={styles.subtitle}>
          Type the driver name and each student's name and pickup location.
        </Text>
      </LinearGradient>

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Driver */}
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <Text style={styles.panelTitle}>Driver</Text>
            <Text style={styles.panelHint}>Required</Text>
          </View>
          <View style={styles.panelBody}>
            <Text style={styles.label}>Driver name</Text>
            <TextInput
              style={styles.input}
              value={driverName}
              onChangeText={setDriverName}
              placeholder="Type the driver's full name"
              placeholderTextColor={PLACEHOLDER}
            />
          </View>
        </View>

        {/* Students */}
        <View style={styles.panel}>
          <View style={styles.panelHead}>
            <Text style={styles.panelTitle}>Students</Text>
            <Text style={styles.panelHint}>Name and pickup location</Text>
          </View>

          <View style={styles.panelBody}>
            <View style={styles.studentHead}>
              <View style={styles.numSpacer} />
              <Text style={styles.colHead}>Student name</Text>
              <Text style={styles.colHead}>Pickup location</Text>
            </View>

            {students.map((student, index) => (
              <View key={index} style={styles.studentRow}>
                <View style={styles.num}>
                  <Text style={styles.numText}>{index + 1}</Text>
                </View>
                <TextInput
                  style={[styles.input, styles.studentInput]}
                  value={student.name}
                  onChangeText={(text) => updateStudent(index, 'name', text)}
                  placeholder="Type student name"
                  placeholderTextColor={PLACEHOLDER}
                  accessibilityLabel={`Student ${index + 1} name`}
                />
                <TextInput
                  style={[styles.input, styles.studentInput]}
                  value={student.location}
                  onChangeText={(text) => updateStudent(index, 'location', text)}
                  placeholder="Type pickup location"
                  placeholderTextColor={PLACEHOLDER}
                  accessibilityLabel={`Student ${index + 1} location`}
                />
              </View>
            ))}

            <Text style={styles.hint}>
              Leave a row empty if you have fewer students for this bus.
            </Text>
          </View>

          <View style={styles.actions}>
            <Pressable
              onPress={clearAll}
              style={({ pressed }) => [styles.btn, styles.btnGhost, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.btnGhostText}>Clear</Text>
            </Pressable>
            <Pressable
              onPress={save}
              style={({ pressed }) => [styles.btn, styles.btnPrimary, pressed && { opacity: 0.8 }]}
            >
              <Text style={styles.btnPrimaryText}>Save bus details</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  hero: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 56,
  },
  eyebrow: {
    color: '#ffffffbf',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  title: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '800',
  },
  subtitle: {
    color: '#ffffffcc',
    fontSize: 14,
    marginTop: 8,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
    gap: 16,
  },
  panel: {
    backgroundColor: colors.card,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: colors.navy,
    shadowOpacity: 0.08,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    marginBottom: 16,
  },
  panelHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  panelTitle: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '700',
  },
  panelHint: {
    color: colors.muted,
    fontSize: 13,
    fontWeight: '600',
  },
  panelBody: {
    padding: 20,
  },
  label: {
    color: colors.ink,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    height: 44,
    backgroundColor: FIELD_BG,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.ink,
  },
  studentHead: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 8,
  },
  numSpacer: {
    width: 36,
  },
  colHead: {
    flex: 1,
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  num: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: NUM_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numText: {
    color: colors.navy2,
    fontSize: 14,
    fontWeight: '700',
  },
  studentInput: {
    flex: 1,
    minWidth: 0,
  },
  hint: {
    marginTop: 6,
    color: colors.muted,
    fontSize: 13,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    backgroundColor: '#fbfcfe',
  },
  btn: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnGhost: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: colors.line,
  },
  btnGhostText: {
    color: colors.ink,
    fontSize: 14,
    fontWeight: '700',
  },
  btnPrimary: {
    backgroundColor: colors.navy,
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});