class Solution {
public:
    ListNode* rotateRight(ListNode* head, int k) {
        if (!head || !head->next) return head;
        int n = 0;
        for (ListNode* p = head; p; p = p->next) n++;
        for (int r = 0; r < k % n; r++) {                   // move the tail to the front
            ListNode* p = head;
            while (p->next->next) p = p->next;
            p->next->next = head;
            head = p->next;
            p->next = nullptr;
        }
        return head;
    }
};
