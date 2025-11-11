import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [loginMethod, setLoginMethod] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const name = await AsyncStorage.getItem('userName');
      const email = await AsyncStorage.getItem('userEmail');
      const method = await AsyncStorage.getItem('loginMethod');
      const usuariosData = JSON.parse(await AsyncStorage.getItem('usuarios') || '[]');

      setUserName(name || '');
      setUserEmail(email || '');
      setLoginMethod(method || '');
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: 'Cerrar sesión',
          onPress: async () => {
            await AsyncStorage.removeItem('isLoggedIn');
            await AsyncStorage.removeItem('userName');
            await AsyncStorage.removeItem('userEmail');
            await AsyncStorage.removeItem('loginMethod');
            navigation.replace('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.userCard}>
        <Text style={styles.cardTitle}>Información del Usuario</Text>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{userName}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{userEmail}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text style={styles.label}>Método de login:</Text>
          <Text style={styles.value}>
            {loginMethod === 'google' ? '🔵 Google' : '📧 Email'}
          </Text>
        </View>
      </View>

      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>Historial de Usuarios</Text>
        {usuarios.length > 0 ? (
          usuarios.map((usuario, index) => (
            <View key={index} style={styles.historyItem}>
              <Text style={styles.historyName}>{usuario.userName}</Text>
              <Text style={styles.historyEmail}>{usuario.userEmail}</Text>
              <Text style={styles.historyMethod}>
                {usuario.loginMethod === 'google' ? '🔵 Google' : '📧 Email'}
              </Text>
            </View>
          ))
        ) : (
          <Text style={styles.noData}>No hay datos disponibles</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  userCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  userInfo: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  historyItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4a90e2',
  },
  historyName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  historyEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  historyMethod: {
    fontSize: 12,
    color: '#999',
  },
  noData: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 16,
  },
});

export default DashboardScreen;

