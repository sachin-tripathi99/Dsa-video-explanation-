class NumArray {
    private final int[] a;

    public NumArray(int[] nums) {
        a = nums.clone();
    }

    public void update(int index, int val) {
        a[index] = val;
    }

    public int sumRange(int left, int right) {
        int s = 0;
        for (int i = left; i <= right; i++) s += a[i];      // walk the whole range
        return s;
    }
}
