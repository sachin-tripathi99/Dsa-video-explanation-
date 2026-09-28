class NumArray {
    int n;
    vector<int> sum;                                        // segment tree, node k has kids 2k, 2k+1

    void build(int k, int lo, int hi, vector<int>& a) {
        if (lo == hi) { sum[k] = a[lo]; return; }
        int mid = (lo + hi) / 2;
        build(2 * k, lo, mid, a);
        build(2 * k + 1, mid + 1, hi, a);
        sum[k] = sum[2 * k] + sum[2 * k + 1];
    }

    void update(int k, int lo, int hi, int i, int val) {
        if (lo == hi) { sum[k] = val; return; }
        int mid = (lo + hi) / 2;
        if (i <= mid) update(2 * k, lo, mid, i, val);
        else update(2 * k + 1, mid + 1, hi, i, val);
        sum[k] = sum[2 * k] + sum[2 * k + 1];               // fix on the way back up
    }

    int query(int k, int lo, int hi, int l, int r) {
        if (r < lo || hi < l) return 0;                     // outside
        if (l <= lo && hi <= r) return sum[k];              // inside
        int mid = (lo + hi) / 2;
        return query(2 * k, lo, mid, l, r) + query(2 * k + 1, mid + 1, hi, l, r);
    }
public:
    NumArray(vector<int>& nums) : n(nums.size()), sum(4 * nums.size()) {
        build(1, 0, n - 1, nums);
    }

    void update(int index, int val) {
        update(1, 0, n - 1, index, val);
    }

    int sumRange(int left, int right) {
        return query(1, 0, n - 1, left, right);
    }
};
