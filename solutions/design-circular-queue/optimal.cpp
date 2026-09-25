class MyCircularQueue {
    vector<int> a;
    int head = 0, size = 0;
public:
    MyCircularQueue(int k) : a(k) {}
    bool enQueue(int value) {
        if (size == (int)a.size()) return false;
        a[(head + size) % a.size()] = value;     // next free slot, wrapping around
        size++;
        return true;
    }
    bool deQueue() {
        if (size == 0) return false;
        head = (head + 1) % a.size();
        size--;
        return true;
    }
    int Front() { return size == 0 ? -1 : a[head]; }
    int Rear() { return size == 0 ? -1 : a[(head + size - 1) % a.size()]; }
    bool isEmpty() { return size == 0; }
    bool isFull() { return size == (int)a.size(); }
};
