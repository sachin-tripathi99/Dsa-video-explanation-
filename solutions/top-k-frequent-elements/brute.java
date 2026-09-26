class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) cnt.merge(x, 1, Integer::sum);
        List<Integer> keys = new ArrayList<>(cnt.keySet());
        keys.sort((a, b) -> cnt.get(b) - cnt.get(a));      // most frequent first
        int[] out = new int[k];
        for (int i = 0; i < k; i++) out[i] = keys.get(i);
        return out;
    }
}
