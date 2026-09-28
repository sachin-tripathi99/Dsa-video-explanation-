class Solution {
    public List<String> findAllRecipes(String[] recipes, List<List<String>> ingredients, String[] supplies) {
        Map<String, Integer> need = new HashMap<>();
        Map<String, List<String>> users = new HashMap<>();  // ingredient → recipes using it
        for (int i = 0; i < recipes.length; i++) {
            need.put(recipes[i], ingredients.get(i).size());
            for (String x : ingredients.get(i)) users.computeIfAbsent(x, k -> new ArrayList<>()).add(recipes[i]);
        }
        Deque<String> q = new ArrayDeque<>(Arrays.asList(supplies));   // start from what we have
        List<String> res = new ArrayList<>();
        while (!q.isEmpty()) {
            String x = q.poll();
            for (String r : users.getOrDefault(x, List.of()))
                if (need.merge(r, -1, Integer::sum) == 0) { res.add(r); q.offer(r); }
        }
        return res;
    }
}
