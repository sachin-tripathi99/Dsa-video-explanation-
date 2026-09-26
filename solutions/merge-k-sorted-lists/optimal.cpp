class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);
        for (ListNode* l : lists) if (l) heap.push(l);          // one head per list
        ListNode dummy(0), *tail = &dummy;
        while (!heap.empty()) {
            ListNode* node = heap.top(); heap.pop();
            tail->next = node;
            tail = node;
            if (node->next) heap.push(node->next);
        }
        return dummy.next;
    }
};
