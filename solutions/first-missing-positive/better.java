class Solution {
    public int firstMissingPositive(int[] nums) {
        Arrays.sort(nums);
        int want = 1;
        for (int x : nums) {
            if (x == want) want++;
            else if (x > want) break;           // gap found
        }
        return want;
    }
}
