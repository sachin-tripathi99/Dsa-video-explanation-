class Solution {
    public int totalFruit(int[] fruits) {
        Map<Integer, Integer> count = new HashMap<>();
        int l = 0, best = 0;
        for (int r = 0; r < fruits.length; r++) {
            count.merge(fruits[r], 1, Integer::sum);
            while (count.size() > 2) {                           // a third type: shrink
                if (count.merge(fruits[l], -1, Integer::sum) == 0) count.remove(fruits[l]);
                l++;
            }
            best = Math.max(best, r - l + 1);
        }
        return best;
    }
}
