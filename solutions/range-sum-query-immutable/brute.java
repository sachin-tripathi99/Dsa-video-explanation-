class NumArray {
    private final int[] nums;

    public NumArray(int[] nums) { this.nums = nums; }

    public int sumRange(int left, int right) {
        int s = 0;
        for (int i = left; i <= right; i++) s += nums[i];
        return s;
    }
}
