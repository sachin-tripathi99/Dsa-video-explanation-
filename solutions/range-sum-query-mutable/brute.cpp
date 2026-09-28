class NumArray {
    vector<int> a;
public:
    NumArray(vector<int>& nums) : a(nums) {}

    void update(int index, int val) {
        a[index] = val;
    }

    int sumRange(int left, int right) {
        int s = 0;
        for (int i = left; i <= right; i++) s += a[i];      // walk the whole range
        return s;
    }
};
