import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Pressable,Image } from 'react-native';
import * as FileSystem from 'expo-file-system';

const MosqueList = () => {
    const [mosques, setMosques] = useState([]);
    const [loading, setLoading] = useState(true);

    const filePath = FileSystem.documentDirectory + 'Mosques.json';

    const fetchMosqueData = async () => {
        try {
            const fileInfo = await FileSystem.getInfoAsync(filePath);
            if (fileInfo.exists) {
                const data = await FileSystem.readAsStringAsync(filePath);
                const parsedData = JSON.parse(data);
                setMosques(parsedData.data);
            } else {
                console.log('File does not exist');
            }
        } catch (error) {
            console.error('Error reading file:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMosqueData();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.mosqueItem}>
            <Text  style={styles.mosqueTitle}>{item.mosque.title}</Text>
            <Text numberOfLines={1} style={styles.mosqueAddress}>{item.mosque.location.address}</Text>
            <Text style={styles.mosqueCoordinates}>
                Latitude: {item.mosque.location.latitude}, Longitude: {item.mosque.location.longitude}
            </Text>
            <Text style={styles.mosqueTimings}>Jamaat Times: {JSON.stringify(item.timings)}</Text>

            {mosques.images && mosques.images.length > 0 && (
                                <View style={styles.imageContainer}>
                                    {mosques.images.map((image, index) => (
                                        <Image
                                            key={index}
                                            source={{ uri: image.uri }}
                                            style={styles.uploadedImage}
                                        />
                                    ))}
                                </View>
                            )}
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />;
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={mosques}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={styles.listContainer}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    listContainer: {
        padding: 20,
    },
    mosqueItem: {
        marginBottom: 20,
        padding: 15,
        backgroundColor: '#f8f8f8',
        borderRadius: 5,
        elevation: 2,
    },
    mosqueTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    mosqueAddress: {
        fontSize: 14,
        color: '#555',
    },
    mosqueCoordinates: {
        fontSize: 12,
        color: '#777',
    },
    mosqueTimings: {
        fontSize: 12,
        color: '#777',
    },
    loadingIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadedImage: {
        height: 160,
        width: 250,
    },
   
});

export default MosqueList;
