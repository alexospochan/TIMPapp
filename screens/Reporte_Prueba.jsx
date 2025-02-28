import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Clipboard, ToastAndroid } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const etiquetas = {
  'Zanjeado': "Descripción del Trabajo RealizadoEl trabajo consistió en la excavación de una zanja para la instalación de cables de fibra óptica...",
  'Avance': 'El trabajo ha progresado de acuerdo al plan establecido y se ha completado un 30% deL trabajo realizado en la fecha proramada', 
  'Daños': 'Se han identificado daños...',
};

export default function ReportScreen() {
  const [prioridad, setPrioridad] = useState('Alta');
  const [etiqueta, setEtiqueta] = useState('Zanjeado');
  const [descripcion, setDescripcion] = useState(etiquetas['Zanjeado']);
  const [imagenes, setImagenes] = useState([]);
  const [coordenadas, setCoordenadas] = useState([]);
  const [mensaje, setMensaje] = useState('');

  const handleEtiquetaChange = (nuevaEtiqueta) => {
    setEtiqueta(nuevaEtiqueta);
    setDescripcion(etiquetas[nuevaEtiqueta]);
  };

  const copiarCoordenadas = async (coordenadas, index) => {
    await Clipboard.setString(coordenadas);
    ToastAndroid.show('Coordenadas copiadas exitosamente', ToastAndroid.SHORT);

    const updatedImages = [...imagenes];
    updatedImages[index].mensaje = 'Coordenadas copiadas exitosamente';
    setImagenes(updatedImages);

    setTimeout(() => {
      const resetImages = [...imagenes];
      resetImages[index].mensaje = '';
      setImagenes(resetImages);
    }, 2000);
  };

  const tomarFoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Se requieren permisos de cámara');
      return;
    }

    if (imagenes.length >= 4) {
      alert('Se ha alcanzado el limite de las 4 imagenes');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 1,
    });

    if (!result.canceled) {
      const { status: locationStatus } = await Location.requestForegroundPermissionsAsync();
      if (locationStatus === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const newImage = {
          uri: result.assets[0].uri,
          coordenadas: `${location.coords.latitude}, ${location.coords.longitude}`,
          latitud: location.coords.latitude,
          longitud: location.coords.longitude,
          mensaje: ''
        };
        setImagenes([newImage, ...imagenes]);
        setCoordenadas([newImage.coordenadas, ...coordenadas]);
      } else {
        alert('Se requieren permisos de ubicación');
      }
    }
  };

  const eliminarFoto = (index) => {
    const updatedImages = imagenes.filter((image, imageIndex) => imageIndex !== index);
    setImagenes(updatedImages);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.mainContainer}>
          <TouchableOpacity style={styles.imageContainer} onPress={tomarFoto}>
            {imagenes.length > 0 ? (
              <Image source={{ uri: imagenes[0].uri }} style={styles.imagePreview} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <Text style={styles.plusSign}>+</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.infoContainer}>
            <Text style={styles.label}>Fecha</Text>
            <Text style={styles.value}>{new Date().toLocaleTimeString()} {new Date().toLocaleDateString()}</Text>
            
            <Text style={styles.label}>Usuario</Text>
            <Text style={styles.value}>miguel@teintmex.com</Text>
            
            <Text style={styles.label}>Etiqueta</Text>
            <View style={styles.buttonContainer}>
              {Object.keys(etiquetas).map((item) => (
                <TouchableOpacity key={item} style={[styles.button, etiqueta === item && styles.buttonSelected]} onPress={() => handleEtiquetaChange(item)}>
                  <Text style={styles.buttonText}>{item}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.label}>Prioridad</Text>
            <View style={styles.buttonContainer}>
              {['Alta', 'Media', 'Baja'].map((level) => (
                <TouchableOpacity key={level} style={[styles.button, prioridad === level && styles.buttonSelected]} onPress={() => setPrioridad(level)}>
                  <Text style={styles.buttonText}>{level}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        <Text style={styles.label}>Observaciones</Text>
        <TextInput
          style={styles.textArea}
          multiline
          value={descripcion}
          onChangeText={setDescripcion}
        />

        
        <Text style={styles.label}>Fotos y Coordenadas:</Text>
        <View style={styles.imageSection}>
          {imagenes.length === 0 ? (
            <Text style={styles.noImagesText}>No hay fotos tomadas</Text>
          ) : (
            imagenes.map((image, index) => (
              <View key={index} style={styles.imageItem}>
                <Text style={styles.imageTitle}>Imagen{index + 1}</Text>
                <Image source={{ uri: image.uri }} style={styles.imagePreview} />
                <TouchableOpacity onPress={() => copiarCoordenadas(image.coordenadas, index)}>
                  <Text style={styles.copyText}>Copiar Coordenadas </Text>
                </TouchableOpacity>
                <Text style={styles.value}>Coordenadas: {image.coordenadas}</Text>
                <Text style={styles.value}>Latitud: {image.latitud}</Text>
                <Text style={styles.value}>Longitud: {image.longitud}</Text>
                {image.mensaje && <Text style={styles.message}>{image.mensaje}</Text>}
                <TouchableOpacity onPress={() => eliminarFoto(index)} style={styles.deleteButton}>
                  <MaterialIcons name="delete" size={24} color="red" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity><FontAwesome name="home" size={24} color="white" /></TouchableOpacity>
        <TouchableOpacity><MaterialIcons name="add-circle-outline" size={28} color="white" /></TouchableOpacity>
        <TouchableOpacity><FontAwesome name="user-circle" size={24} color="white" /></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#040D20' },
  content: { flex: 1, padding: 15 },
  mainContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  infoContainer: { flex: 1, marginLeft: 10 },
  label: { color: 'white', fontSize: 16, fontWeight: 'bold', marginTop: 10 },
  value: { color: 'white', fontSize: 16, marginBottom: 10 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 },
  button: { backgroundColor: '#253241', padding: 6, borderRadius: 10},
  buttonSelected: { backgroundColor: '#2563eb' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  textArea: { backgroundColor: '#1e293b', color: 'white', padding: 10, borderRadius: 5, minHeight: 100, textAlignVertical: 'top' },
  imageContainer: { backgroundColor: '#1e293b', padding: 10, borderRadius: 5, width: 180, height: 240, alignItems: 'center', justifyContent: 'center' },
  imagePreview: { width: '100%', height: 180, borderRadius: 5 },
  imagePlaceholder: { width: '100%', height: 180, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1e293b', borderRadius: 5, borderWidth: 2, borderColor: '#4a5568' },
  plusSign: { fontSize: 40, color: 'white', fontWeight: 'bold' },
  bottomNav: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    paddingVertical: 5, 
    paddingHorizontal: 15, 
    backgroundColor: '#1e293b',
    height: 45, 
    alignItems: 'center'  
  },
  imageSection: { marginBottom: 20, backgroundColor: '#1e293b', padding: 15, borderRadius: 5 },
  noImagesText: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 10 },
  imageItem: { marginBottom: 15 },
  imageTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  copyText: { color: '#2563eb', fontSize: 14, marginTop: 5 },
  message: { color: '#2563eb', fontSize: 16, textAlign: 'center', marginTop: 10 },
  deleteButton: { position: 'absolute', top: 10, right: 10 }
});
