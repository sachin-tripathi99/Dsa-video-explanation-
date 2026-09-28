class Solution {
    public int findMaximumXOR(int[] nums) {
        int best = 0;
        for (int i = 0; i < nums.length; i++)
            for (int j = i + 1; j < nums.length; j++) best = Math.max(best, nums[i] ^ nums[j]);   // every pair
        return best;
    }
}
