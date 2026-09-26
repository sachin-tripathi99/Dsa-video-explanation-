class MedianFinder {
    vector<int> a;                                      // kept sorted
public:
    MedianFinder() {}

    void addNum(int num) {
        a.insert(lower_bound(a.begin(), a.end(), num), num);   // O(n) shift
    }

    double findMedian() {
        int n = a.size();
        return n % 2 ? a[n / 2] : ((long long)a[n / 2 - 1] + a[n / 2]) / 2.0;
    }
};
