class Solution {
    public int subarraySum(int[] nums, int k) {
        Map<Integer, Integer> count = new HashMap<>();
        count.put(0, 1);                          // the empty prefix
        int run = 0, ans = 0;
        for (int x : nums) {
            run += x;
            ans += count.getOrDefault(run - k, 0);
            count.merge(run, 1, Integer::sum);
        }
        return ans;
    }
}
