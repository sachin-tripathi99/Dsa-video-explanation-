class NumArray {
    private final int[] a, block;
    private final int b;

    public NumArray(int[] nums) {
        a = nums.clone();
        b = Math.max(1, (int) Math.ceil(Math.sqrt(a.length)));   // block size ~ √n
        block = new int[(a.length + b - 1) / b];
        for (int i = 0; i < a.length; i++) block[i / b] += a[i];
    }

    public void update(int index, int val) {
        block[index / b] += val - a[index];
        a[index] = val;
    }

    public int sumRange(int left, int right) {
        int s = 0, i = left;
        while (i <= right && i % b != 0) s += a[i++];       // loose elements on the left
        while (i + b - 1 <= right) { s += block[i / b]; i += b; }   // whole blocks
        while (i <= right) s += a[i++];                     // loose elements on the right
        return s;
    }
}
