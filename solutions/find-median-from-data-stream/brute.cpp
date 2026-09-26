class MedianFinder {
    vector<int> a;
public:
    MedianFinder() {}

    void addNum(int num) { a.push_back(num); }

    double findMedian() {
        sort(a.begin(), a.end());                       // sort on every query
        int n = a.size();
        return n % 2 ? a[n / 2] : ((long long)a[n / 2 - 1] + a[n / 2]) / 2.0;
    }
};
