import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../theme';

interface SizeGuideModalProps {
  visible: boolean;
  onClose: () => void;
}

const SIZE_CHART = [
  { size: 'XS', chest: '34 - 36 in (86-91 cm)', waist: '28 - 30 in (71-76 cm)', hips: '34 - 36 in (86-91 cm)' },
  { size: 'S', chest: '37 - 39 in (94-99 cm)', waist: '30 - 32 in (76-81 cm)', hips: '37 - 39 in (94-99 cm)' },
  { size: 'M', chest: '40 - 42 in (102-107 cm)', waist: '32 - 34 in (81-86 cm)', hips: '40 - 42 in (102-107 cm)' },
  { size: 'L', chest: '43 - 45 in (109-114 cm)', waist: '34 - 36 in (86-91 cm)', hips: '43 - 45 in (109-114 cm)' },
  { size: 'XL', chest: '46 - 48 in (117-122 cm)', waist: '36 - 38 in (91-97 cm)', hips: '46 - 48 in (117-122 cm)' },
];

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  visible,
  onClose,
}) => {
  const { colors, typography, borderRadius } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable
          style={[
            styles.modalContent,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
              borderRadius: borderRadius.lg,
            },
          ]}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    color: colors.text,
                    fontSize: typography.sizes.h3,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                ATHLETIC SIZE GUIDE
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  {
                    color: colors.textSecondary,
                    fontSize: typography.sizes.caption,
                  },
                ]}
              >
                Body measurements in inches & centimetres
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Table */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[styles.tableRow, styles.tableHeader, { backgroundColor: colors.background }]}>
              <Text style={[styles.cell, styles.colSize, { color: colors.accent, fontWeight: '700' }]}>SIZE</Text>
              <Text style={[styles.cell, styles.colData, { color: colors.text, fontWeight: '700' }]}>CHEST</Text>
              <Text style={[styles.cell, styles.colData, { color: colors.text, fontWeight: '700' }]}>WAIST</Text>
            </View>

            {SIZE_CHART.map((row, idx) => (
              <View
                key={row.size}
                style={[
                  styles.tableRow,
                  {
                    borderBottomColor: colors.border,
                    backgroundColor: idx % 2 === 0 ? colors.surface : colors.card,
                  },
                ]}
              >
                <Text style={[styles.cell, styles.colSize, { color: colors.text, fontWeight: '700' }]}>
                  {row.size}
                </Text>
                <Text style={[styles.cell, styles.colData, { color: colors.textSecondary }]}>
                  {row.chest}
                </Text>
                <Text style={[styles.cell, styles.colData, { color: colors.textSecondary }]}>
                  {row.waist}
                </Text>
              </View>
            ))}

            <View style={[styles.tipsBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
              <Text style={[styles.tipsTitle, { color: colors.text, fontWeight: '700' }]}>
                FIT ADVICE
              </Text>
              <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
                • If you are between sizes, size up for a relaxed pump cover drape or size down for a tighter muscular compression fit.
              </Text>
              <Text style={[styles.tipsText, { color: colors.textSecondary }]}>
                • All pre-shrunk cotton blends retain length and shape after cold wash.
              </Text>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxHeight: '80%',
    padding: 20,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    marginBottom: 16,
    borderBottomWidth: 1,
  },
  title: {
    letterSpacing: 1,
  },
  subtitle: {
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  tableHeader: {
    paddingVertical: 10,
  },
  cell: {
    fontSize: 12,
  },
  colSize: {
    width: 45,
  },
  colData: {
    flex: 1,
    paddingRight: 6,
  },
  tipsBox: {
    marginTop: 20,
    padding: 14,
    borderWidth: 1,
  },
  tipsTitle: {
    fontSize: 12,
    letterSpacing: 1,
    marginBottom: 6,
  },
  tipsText: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },
});

