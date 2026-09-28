class NumArray {
    vector<int> a, block;
    int b;
public:
    NumArray(vector<int>& nums) : a(nums) {
        b = max(1, (int)ceil(sqrt((double)a.size())));      // block size ~ √n
        block.assign((a.size() + b - 1) / b, 0);
        for (int i = 0; i < (int)a.size(); i++) block[i / b] += a[i];
    }

    void update(int index, int val) {
        block[index / b] += val - a[index];
        a[index] = val;
    }

    int sumRange(int left, int right) {
        int s = 0, i = left;
        while (i <= right && i % b != 0) s += a[i++];       // loose elements on the left
        while (i + b - 1 <= right) { s += block[i / b]; i += b; }   // whole blocks
        while (i <= right) s += a[i++];                     // loose elements on the right
        return s;
    }
};
