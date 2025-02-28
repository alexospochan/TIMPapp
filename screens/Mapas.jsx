import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const projects = [
  { id: 1, route: 'D.F - Alvarado', distance: '95 / 237 Km', manager: 'Uriel Espronceda Z.' },
  { id: 2, route: 'D.F - Alvarado', distance: '85 / 237 Km', manager: 'Uriel Espronceda Z.' },
  { id: 3, route: 'D.F - Alvarado', distance: '75 / 237 Km', manager: 'Uriel Espronceda Z.' },
  { id: 4, route: 'D.F - Alvarado', distance: '5 / 237 Km', manager: 'Uriel Espronceda Z.' },
  { id: 5, route: 'D.F - Alvarado', distance: '95 / 237 Km', manager: 'Uriel Espronceda Z.' },
  { id: 6, route: 'D.F - Alvarado', distance: '95 / 237 Km', manager: 'Uriel Espronceda Z.' }
];

export default function App() {
  const navigation = useNavigation();

  const handleNavigate = (id) => {
    if (id === 1) {
      navigation.navigate('Reportes');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/TIMP.png')} style={styles.logo} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Text style={styles.menuItem}>Usuarios</Text>
          <Text style={styles.menuItem}>Mapas</Text>
          <Text style={styles.menuItem}>Lista</Text>
          <Text style={styles.menuItem}>Reporte</Text>
          <Text style={styles.menuItem}>Pinturas</Text>
          <Text style={styles.menuItem}>Reportes</Text>
        </ScrollView>
      </View>

      <ScrollView>
        {projects.map((project) => (
          <View key={project.id} style={styles.card}>
            <Image
              source={{ uri: 'https://via.placeholder.com/300x150' }}
              style={styles.mapImage}
            />
            <TouchableOpacity style={styles.addButton} onPress={() => handleNavigate(project.id)}>
              <Text style={styles.addButtonText}>Agregar +</Text>
            </TouchableOpacity>
            <View style={styles.cardInfo}>
              <Text style={styles.infoText}>Proyecto: {project.route}</Text>
              <Text style={styles.infoText}>Kilometraje: {project.distance}</Text>
              <Text style={styles.infoText}>Project manager: {project.manager}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    paddingTop: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#1E293B',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  menuItem: {
    color: 'white',
    marginHorizontal: 10,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1E293B',
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  mapImage: {
    height: 150,
    width: '100%',
  },
  addButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 5,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cardInfo: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  infoText: {
    color: 'white',
    fontSize: 14,
    marginVertical: 2,
  },
});
