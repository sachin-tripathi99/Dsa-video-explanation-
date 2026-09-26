class Solution {
    public int totalFruit(int[] fruits) {
        int best = 0;
        for (int i = 0; i < fruits.length; i++) {
            Set<Integer> types = new HashSet<>();
            for (int j = i; j < fruits.length; j++) {
                types.add(fruits[j]);
                if (types.size() > 2) break;
                best = Math.max(best, j - i + 1);
            }
        }
        return best;
    }
}
