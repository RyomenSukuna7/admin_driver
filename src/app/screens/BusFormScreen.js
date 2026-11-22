import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';
import { busStore } from '../data/busStore';
import EditDrawer from '../components/EditDrawer';

const BUS_FIELDS = [
  { key: 'busNumber', label: 'Bus number plate', placeholder: 'e.g. RJ19 PB 1234', required: true, caps: 'characters' },
  { key: 'route', label: 'Route', placeholder: 'e.g. Route 1 - Ratanada', required: true },
  { key: 'driverName', label: "Driver's full name", placeholder: 'e.g. Ramesh Kumar', required: true },
  { key: 'driverPhone', label: "Driver's mobile (used to log in)", placeholder: '10-digit mobile number', required: true, phone: true },
];

const STUDENT_FIELDS = [
  { key: 'name', label: 'Student name', placeholder: 'e.g. Aarav Kapoor', required: true },
  { key: 'className', label: 'Class', placeholder: 'e.g. 4 B', caps: 'characters' },
  { key: 'location', label: 'Pickup stop', placeholder: 'e.g. Maple St', required: true },
  { key: 'parentPhone', label: "Parent's mobile (used to log in)", placeholder: '10-digit mobile number', required: true, phone: true },
  { key: 'parentPhone2', label: "Second parent's mobile", placeholder: 'Optional', phone: true },
];

// The bus's Unique ID is given by NanhaSafar, never typed by the school.
// For now the app makes it; once the backend is ready, the server will assign it.
// Random, with no look-alike characters (no 0/O, 1/I/L), e.g. "NS-7KQ2M4".
const newUniqueId = () => {
  const chars = '23456789ABCDEFGHJKMNPQRSTUVWXYZ';
  let id = 'NS-';
  for (let i = 0; i < 6; i++) id += chars[Math.floor(Math.random() * chars.length)];
  return id;
};
const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const showPhone = (p) => (p ? `${p.slice(0, 5)} ${p.slice(5)}` : '');
const initialsOf = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Ionicons name={icon} size={16} color={colors.muted} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={1}>
        {value || '-'}
      </Text>
    </View>
  );
}

export default function BusFormScreen() {
  const [bus, setBus] = useState(() => {
    const saved = {
      busNumber: busStore.busNumber ?? '',
      route: busStore.route ?? '',
      uniqueId: busStore.uniqueId ?? '',
      driverName: busStore.driverName ?? '',
      driverPhone: busStore.driverPhone ?? '',
    };
    // A bus saved before Unique IDs existed gets one now.
    if ((saved.busNumber || saved.driverName) && !saved.uniqueId) {
      saved.uniqueId = newUniqueId();
      busStore.uniqueId = saved.uniqueId;
    }
    return saved;
  });
  // Old saved data had 8 fixed rows; keep only rows that have a name.
  const [students, setStudents] = useState(() =>
    (busStore.students ?? [])
      .filter((s) => s.name?.trim())
      .map((s) => ({ ...s, id: s.id ?? newId() }))
  );
  // null = drawer closed · { kind: 'bus' } · { kind: 'student', id } (id null = adding)
  const [editing, setEditing] = useState(null);

  const hasBus = Boolean(bus.busNumber || bus.driverName);
  const editingStudent =
    editing?.kind === 'student' && editing.id ? students.find((s) => s.id === editing.id) : null;

  const saveBus = (value) => {
    const next = {
      busNumber: value.busNumber.toUpperCase(),
      route: value.route,
      uniqueId: bus.uniqueId || newUniqueId(), // kept once given; the school can't change it
      driverName: value.driverName,
      driverPhone: value.driverPhone,
    };
    setBus(next);
    Object.assign(busStore, next);
    setEditing(null);
  };

  const saveStudents = (next) => {
    setStudents(next);
    busStore.students = next;
    setEditing(null);
  };

  const saveStudent = (value) => {
    if (editing.id) {
      saveStudents(students.map((s) => (s.id === editing.id ? { ...s, ...value } : s)));
    } else {
      saveStudents([...students, { ...value, id: newId() }]);
    }
  };

  const deleteStudent = () => saveStudents(students.filter((s) => s.id !== editing.id));

  return (
    <View style={styles.screen}>
      {/* Header */}
      <LinearGradient
        colors={[colors.navy, colors.navy2]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.hero}
      >
        <View style={styles.badge}>
          <Ionicons name="shield-checkmark-outline" size={13} color="#fff" />
          <Text style={styles.badgeText}>Admin</Text>
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {hasBus ? `Bus ${bus.busNumber}` : 'Set up your bus'}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {hasBus ? bus.route : 'Add the bus, its driver and the students'}
        </Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Bus and driver */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.cardTitleRow}>
              <View style={styles.sectionIcon}>
                <Ionicons name="bus-outline" size={16} color={colors.navy2} />
              </View>
              <Text style={styles.cardTitle}>Bus and driver</Text>
            </View>
            {hasBus ? (
              <Pressable
                onPress={() => setEditing({ kind: 'bus' })}
                hitSlop={8}
                style={({ pressed }) => [styles.headBtn, pressed && styles.pressed]}
              >
                <Ionicons name="pencil" size={14} color={colors.navy2} />
                <Text style={styles.headBtnText}>Edit</Text>
              </Pressable>
            ) : null}
          </View>

          {hasBus ? (
            <View style={styles.cardBody}>
              <InfoRow icon="card-outline" label="Number plate" value={bus.busNumber} />
              <InfoRow icon="git-branch-outline" label="Route" value={bus.route} />
              <InfoRow icon="key-outline" label="Unique ID" value={bus.uniqueId} />
              <InfoRow icon="person-outline" label="Driver" value={bus.driverName} />
              <InfoRow icon="call-outline" label="Mobile" value={showPhone(bus.driverPhone)} />
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No bus added yet.</Text>
              <Pressable
                onPress={() => setEditing({ kind: 'bus' })}
                style={({ pressed }) => [styles.btnPrimary, pressed && styles.pressed]}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.btnPrimaryText}>Add bus and driver</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Students */}
        <View style={styles.card}>
          <View style={styles.cardHead}>
            <View style={styles.cardTitleRow}>
              <View style={styles.sectionIcon}>
                <Ionicons name="people-outline" size={16} color={colors.navy2} />
              </View>
              <Text style={styles.cardTitle}>Students</Text>
              <View style={styles.countChip}>
                <Text style={styles.countText}>{students.length}</Text>
              </View>
            </View>
            <Pressable
              onPress={() => setEditing({ kind: 'student', id: null })}
              hitSlop={8}
              style={({ pressed }) => [styles.headBtn, pressed && styles.pressed]}
            >
              <Ionicons name="add" size={16} color={colors.navy2} />
              <Text style={styles.headBtnText}>Add</Text>
            </Pressable>
          </View>

          {students.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No students yet. Tap Add to add the first one.</Text>
            </View>
          ) : (
            students.map((s, index) => (
              <Pressable
                key={s.id}
                onPress={() => setEditing({ kind: 'student', id: s.id })}
                style={({ pressed }) => [
                  styles.studentRow,
                  index === students.length - 1 && { borderBottomWidth: 0 },
                  pressed && styles.rowPressed,
                ]}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{initialsOf(s.name)}</Text>
                </View>
                <View style={styles.studentInfo}>
                  <Text style={styles.studentName} numberOfLines={1}>
                    {s.name}
                  </Text>
                  <Text style={styles.studentMeta} numberOfLines={1}>
                    {[s.className && `Class ${s.className}`, s.location].filter(Boolean).join(' · ')}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={colors.muted} />
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      <EditDrawer
        visible={editing !== null}
        title={
          editing?.kind === 'bus'
            ? hasBus ? 'Edit bus and driver' : 'Add bus and driver'
            : editingStudent ? 'Edit student' : 'Add student'
        }
        fields={editing?.kind === 'bus' ? BUS_FIELDS : STUDENT_FIELDS}
        value={editing?.kind === 'bus' ? bus : editingStudent ?? {}}
        onSave={editing?.kind === 'bus' ? saveBus : saveStudent}
        onDelete={editingStudent ? deleteStudent : undefined}
        onClose={() => setEditing(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  // Header
  hero: {
    paddingTop: 56,
    paddingHorizontal: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    marginBottom: 12,
  },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  title: { color: '#fff', fontSize: 22, fontWeight: '800' },
  subtitle: { color: '#ffffffcc', fontSize: 14, marginTop: 4 },

  // Scroll content
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32, gap: 16 },

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
  },
  cardHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
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
  countChip: {
    backgroundColor: colors.tealSoft,
    paddingVertical: 2,
    paddingHorizontal: 9,
    borderRadius: 999,
  },
  countText: { color: colors.teal, fontSize: 12, fontWeight: '700' },
  headBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: colors.avatarBg,
  },
  headBtnText: { color: colors.navy2, fontSize: 13, fontWeight: '700' },
  cardBody: { paddingVertical: 8, paddingHorizontal: 18 },

  // Bus details
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  infoLabel: { color: colors.muted, fontSize: 14, width: 100 },
  infoValue: { color: colors.ink, fontSize: 15, fontWeight: '600', flex: 1 },

  // Empty states
  empty: { padding: 18, gap: 14, alignItems: 'flex-start' },
  emptyText: { color: colors.muted, fontSize: 14 },

  // Students
  studentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  rowPressed: { backgroundColor: '#f8fafc' },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.avatarBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: colors.navy2, fontSize: 14, fontWeight: '700' },
  studentInfo: { flex: 1, minWidth: 0 },
  studentName: { color: colors.ink, fontSize: 15, fontWeight: '700' },
  studentMeta: { color: colors.muted, fontSize: 13, marginTop: 2 },

  // Buttons
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.navy,
  },
  btnPrimaryText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  pressed: { opacity: 0.8 },
});
