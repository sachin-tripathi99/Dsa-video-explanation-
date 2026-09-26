class NumArray {
    private final int[] P;                    // P[i] = sum of the first i elements

    public NumArray(int[] nums) {
        P = new int[nums.length + 1];
        for (int i = 0; i < nums.length; i++) P[i + 1] = P[i] + nums[i];
    }

    public int sumRange(int left, int right) {
        return P[right + 1] - P[left];
    }
}
