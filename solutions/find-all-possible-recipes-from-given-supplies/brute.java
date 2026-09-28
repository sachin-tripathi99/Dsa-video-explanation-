class Solution {
    public List<String> findAllRecipes(String[] recipes, List<List<String>> ingredients, String[] supplies) {
        Set<String> have = new HashSet<>(Arrays.asList(supplies));
        boolean[] made = new boolean[recipes.length];
        List<String> res = new ArrayList<>();
        boolean changed = true;
        while (changed) {                                   // sweep until nothing new is made
            changed = false;
            for (int i = 0; i < recipes.length; i++) {
                if (made[i] || !have.containsAll(ingredients.get(i))) continue;
                made[i] = true;
                have.add(recipes[i]);
                res.add(recipes[i]);
                changed = true;
            }
        }
        return res;
    }
}
