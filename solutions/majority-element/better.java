class Solution {
    public int majorityElement(int[] nums) {
        Map<Integer, Integer> counts = new HashMap<>();
        for (int x : nums) {
            int c = counts.merge(x, 1, Integer::sum);
            if (c > nums.length / 2) return x;
        }
        return -1;
    }
}
