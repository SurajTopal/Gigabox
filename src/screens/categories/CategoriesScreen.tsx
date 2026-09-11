import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlashList } from '@shopify/flash-list';
import { useProducts } from '../../hooks/useProducts';
import { styles } from './CategoriesScreen.styles';

interface CategoryCardProps {
  name: string;
  onPress?: () => void;
}

const CategoryCard = React.memo(({ name, onPress }: CategoryCardProps) => (
  <TouchableOpacity style={styles.categoryCard} onPress={onPress}>
    <View style={styles.categoryIcon}>
      <Text style={{ fontSize: 40 }}>📦</Text>
    </View>
    <Text style={styles.categoryName} numberOfLines={2}>
      {name}
    </Text>
  </TouchableOpacity>
));

CategoryCard.displayName = 'CategoryCard';

export default function CategoriesScreen() {
  const { categories, loading, loadProductsByCategory } = useProducts();

  const handleCategoryPress = useCallback(
    (category: string) => {
      loadProductsByCategory(category);
    },
    [loadProductsByCategory],
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gigabox</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563eb" />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gigabox</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Browse Categories</Text>

        {categories.length > 0 ? (
          <FlashList
            data={categories}
            renderItem={({ item }) => (
              <CategoryCard name={item} onPress={() => handleCategoryPress(item)} />
            )}
            keyExtractor={(item) => item}
            numColumns={2}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesList}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>No categories found</Text>
          </View>
        )}

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
}
