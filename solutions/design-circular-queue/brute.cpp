class MyCircularQueue {
    vector<int> data;
    int k;
public:
    MyCircularQueue(int k) : k(k) {}
    bool enQueue(int value) { if ((int)data.size() == k) return false; data.push_back(value); return true; }
    bool deQueue() { if (data.empty()) return false; data.erase(data.begin()); return true; }   // shifts
    int Front() { return data.empty() ? -1 : data.front(); }
    int Rear() { return data.empty() ? -1 : data.back(); }
    bool isEmpty() { return data.empty(); }
    bool isFull() { return (int)data.size() == k; }
};
