class MedianFinder {
    priority_queue<int> lo;                             // smaller half (max-heap)
    priority_queue<int, vector<int>, greater<int>> hi;  // bigger half (min-heap)
public:
    MedianFinder() {}

    void addNum(int num) {
        lo.push(num);
        hi.push(lo.top()); lo.pop();                    // largest small → hi
        if (hi.size() > lo.size()) { lo.push(hi.top()); hi.pop(); }   // lo keeps the extra one
    }

    double findMedian() {
        return lo.size() > hi.size() ? lo.top() : ((long long)lo.top() + hi.top()) / 2.0;
    }
};
