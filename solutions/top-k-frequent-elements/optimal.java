class Solution {
    public int[] topKFrequent(int[] nums, int k) {
        Map<Integer, Integer> cnt = new HashMap<>();
        for (int x : nums) cnt.merge(x, 1, Integer::sum);
        List<List<Integer>> bucket = new ArrayList<>();
        for (int i = 0; i <= nums.length; i++) bucket.add(new ArrayList<>());
        for (var e : cnt.entrySet()) bucket.get(e.getValue()).add(e.getKey());   // bucket[count]
        int[] out = new int[k];
        int j = 0;
        for (int c = nums.length; c >= 1 && j < k; c--)
            for (int key : bucket.get(c)) if (j < k) out[j++] = key;
        return out;
    }
}
