import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as GoogleSignIn from 'expo-google-sign-in';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('maria.diaz@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;
    if (email.length > 254) return false;
    if (email.startsWith('.') || email.endsWith('.')) return false;
    if (email.includes('..')) return false;
    return true;
  };

  const isValidPassword = (password) => {
    return password.length >= 8;
  };

  const handleLogin = async () => {
    setError('');
    let hasError = false;
    let errorText = '';

    if (!email) {
      errorText = '* El email es requerido';
      hasError = true;
    } else if (!isValidEmail(email)) {
      errorText = '* Email inválido. Usa formato: usuario@dominio.com';
      hasError = true;
    }

    if (!password) {
      errorText = '* La contraseña es requerida';
      hasError = true;
    } else if (!isValidPassword(password)) {
      errorText = '* La contraseña debe tener al menos 8 caracteres';
      hasError = true;
    }

    if (hasError) {
      setError(errorText);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://vivac-backend-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await loginSuccess(email, 'email', data.token);
      } else {
        setError(data.message || '* Email o contraseña incorrectos');
        setLoading(false);
      }
    } catch (error) {
      setError('* Error de conexión. Intenta de nuevo.');
      setLoading(false);
      console.error('Login error:', error);
    }
  };

  const loginSuccess = async (userEmail, loginMethod, token = null) => {
    const userName = userEmail.split('@')[0].split('.').map(part =>
      part.charAt(0).toUpperCase() + part.slice(1)
    ).join(' ');

    const loginTime = new Date().getTime();

    await AsyncStorage.setItem('userName', userName);
    await AsyncStorage.setItem('userEmail', userEmail);
    await AsyncStorage.setItem('isLoggedIn', 'true');
    await AsyncStorage.setItem('loginMethod', loginMethod);
    await AsyncStorage.setItem('loginTime', loginTime.toString());

    if (token) {
      await AsyncStorage.setItem('authToken', token);
    }

    // Save to history
    let usuarios = JSON.parse(await AsyncStorage.getItem('usuarios') || '[]');
    usuarios.push({
      userName,
      userEmail,
      loginMethod,
      loginTime,
    });
    await AsyncStorage.setItem('usuarios', JSON.stringify(usuarios));

    Alert.alert('¡Login exitoso!', `Bienvenido ${userName}`);
    setLoading(false);
    navigation.replace('Dashboard');
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignIn.initAsync({
        clientId: '118582736340-9fnfvji5lcb77k5t3sjq101pta6dakaj.apps.googleusercontent.com',
      });
      const result = await GoogleSignIn.signInAsync();
      if (result.type === 'success') {
        await loginSuccess(result.user.email, 'google');
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background.jpg')}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>Ejemplo de logo ★ LOGO</Text>
          </View>

          <Text style={styles.headline}>Bienvenido a VivacWeb</Text>
          <Text style={styles.subheadline}>
            Descubre nuevas rutas, comparte tus aventuras y vive la naturaleza al máximo.
          </Text>

          <View style={styles.form}>
            <Text style={styles.formTitle}>Iniciar sesión</Text>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholder="maria.diaz@gmail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!loading}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Contraseña</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput, error && styles.inputError]}
                  placeholder="Mínimo 8 caracteres"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  editable={!loading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.toggleButton}
                >
                  <Text style={styles.toggleText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {error ? <Text style={styles.errorMessage}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>Acceder</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPassword}>¿Has olvidado tu contraseña?</Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>o</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, loading && styles.buttonDisabled]}
              onPress={handleGoogleSignIn}
              disabled={loading}
            >
              <Text style={styles.googleButtonText}>Iniciar sesión con Google</Text>
            </TouchableOpacity>

            <View style={styles.registerLink}>
              <Text style={styles.registerText}>¿Aún no tienes una cuenta? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                <Text style={styles.registerLinkText}>Regístrate</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  headline: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subheadline: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  form: {
    width: '100%',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#ff4444',
    backgroundColor: '#fff5f5',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
  },
  toggleButton: {
    position: 'absolute',
    right: 12,
    padding: 8,
  },
  toggleText: {
    fontSize: 18,
  },
  errorMessage: {
    color: '#ff4444',
    fontSize: 12,
    marginBottom: 12,
  },
  submitButton: {
    backgroundColor: '#1b5e3f',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  forgotPassword: {
    color: '#4a90e2',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 12,
    color: '#999',
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  registerLink: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    color: '#666',
    fontSize: 14,
  },
  registerLinkText: {
    color: '#4a90e2',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;

