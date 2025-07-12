import React, { useState, useEffect } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import CustomButton from './CustomButton';
import Slider from '@react-native-community/slider';
import { 
    Modal, 
    View, 
    Text, 
    StyleSheet, 
} from 'react-native';


const SERVICE_TYPES = [
  { label: 'All', value: null },
  { label: 'Cleaning', value: 'Cleaning' },
  { label: 'Installation', value: 'Installation' },
  { label: 'Renovation', value: 'Renovation' },
  { label: 'Repairs', value: 'Repairs' },
  { label: 'Others', value: 'Others' },
];

const MIN_PRICE = 0;
const MAX_PRICE = 100000;

const FilterModal = ({ visible, onClose, filters, setFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [typeOpen, setTypeOpen] = useState(false);
  const [typeItems, setTypeItems] = useState(SERVICE_TYPES);

  // For slider
  const [minPrice, setMinPrice] = useState(filters.minPrice ?? MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice ?? MAX_PRICE);

  useEffect(() => {
    setLocalFilters(filters);
    setMinPrice(filters.minPrice ?? MIN_PRICE);
    setMaxPrice(filters.maxPrice ?? MAX_PRICE);
  }, [filters, visible]);

  const applyFilters = () => {
    setFilters({
      ...localFilters,
      minPrice,
      maxPrice,
    });
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters({ type: null });
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Text style={styles.title}>Filter Listings</Text>
          {/* Service Type */}
          <Text style={styles.label}>Service Type:</Text>
          <DropDownPicker
            open={typeOpen}
            value={localFilters.type}
            items={typeItems}
            setOpen={setTypeOpen}
            setValue={val => setLocalFilters({ ...localFilters, type: val() })}
            setItems={setTypeItems}
            style={styles.dropdown}
            dropDownContainerStyle={styles.dropdownContainer}
            placeholder="Select type"
            zIndex={1000}
          />

          {/* Price Range */}
          <Text style={styles.label}>Min Price: ${minPrice}</Text>
          <Slider
            minimumValue={MIN_PRICE}
            maximumValue={maxPrice}
            value={minPrice}
            step={1}
            onValueChange={setMinPrice}
            style={styles.slider}
            minimumTrackTintColor="maroon"
            maximumTrackTintColor="#ccc"
          />
          <Text style={styles.label}>Max Price: ${maxPrice}</Text>
          <Slider
            minimumValue={minPrice}
            maximumValue={MAX_PRICE}
            value={maxPrice}
            step={1}
            onValueChange={setMaxPrice}
            style={styles.slider}
            minimumTrackTintColor="maroon"
            maximumTrackTintColor="#ccc"
          />

          <View style={styles.buttonRow}>
            <View style={styles.buttonLeft}>
                <CustomButton text="Cancel" color="#ccc" onPress={onClose} />
            </View>
            <View style={styles.buttonCenter}>
                <CustomButton text="Clear" color="#aaa" onPress={clearFilters} />
            </View>
            <View style={styles.buttonRight}>
                <CustomButton text="Apply" color="maroon" onPress={applyFilters} />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  modal: { 
    width: 320, 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20 
  },
  title: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 10,
    color: 'black'
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
    color: 'maroon'
  },
  dropdown: {
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 10,
    zIndex: 1000,
  },
  dropdownContainer: {
    borderColor: '#ccc',
    borderRadius: 8,
    zIndex: 1000,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  buttonRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginTop: 20,
    gap: 10,
  },
  buttonLeft: {
    width: '33%',
    justifyContent: 'flex-start',
  },
  buttonCenter: {
    width: '33%',
    justifyContent: 'center',
  },
  buttonRight: {
    width: '33%',
    justifyContent: 'flex-end',
  },
});

export default FilterModal;